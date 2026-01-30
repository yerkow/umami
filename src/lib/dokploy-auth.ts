import debug from 'debug';
import { ROLES } from '@/lib/constants';
import { getOrCreateUmamiUserForOrg } from '@/queries/prisma/dokploy-org';
import { getUser } from '@/queries/prisma/user';

const log = debug('umami:dokploy-auth');

const DOKPLOY_API_URL = process.env.DOKPLOY_API_URL || 'http://localhost:3000';
const DOKPLOY_VALIDATE_SESSION_PATH = '/api/analytics/validate-session';

/**
 * Читает cookie Better Auth из запроса
 */
export function getDokploySessionCookie(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return null;
  }

  // Better Auth использует cookie с именем "better-auth.session_token" или подобным
  // Проверяем несколько возможных имен
  const cookieNames = ['better-auth.session_token', 'better-auth.session', 'session_token'];

  for (const name of cookieNames) {
    const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Валидирует сессию Dokploy через API и получает org_id
 */
export async function validateDokploySession(
  request: Request,
): Promise<{ valid: boolean; orgId?: string; userId?: string; error?: string }> {
  try {
    const cookieHeader = request.headers.get('cookie');

    if (!cookieHeader) {
      log('No cookie header found');
      return { valid: false, error: 'No session cookie' };
    }

    // Вызываем API Dokploy для валидации сессии
    // Используем полный URL, если DOKPLOY_API_URL не указан, используем относительный путь
    const apiUrl = DOKPLOY_API_URL.startsWith('http')
      ? `${DOKPLOY_API_URL}${DOKPLOY_VALIDATE_SESSION_PATH}`
      : `${DOKPLOY_VALIDATE_SESSION_PATH}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader,
        'Content-Type': 'application/json',
      },
      // Важно: передаем cookie для кросс-доменных запросов
      credentials: 'include',
    });

    if (!response.ok) {
      log('Dokploy session validation failed:', response.status, response.statusText);
      return {
        valid: false,
        error: `Validation failed: ${response.status}`,
      };
    }

    const data = await response.json();

    if (!data.valid || !data.orgId) {
      log('Invalid session or no orgId:', data);
      return {
        valid: false,
        error: data.error || 'Invalid session',
      };
    }

    log('Dokploy session validated:', { orgId: data.orgId, userId: data.userId });

    return {
      valid: true,
      orgId: data.orgId,
      userId: data.userId,
    };
  } catch (error) {
    log('Error validating Dokploy session:', error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Проверяет авторизацию через Dokploy и возвращает Umami user для организации
 */
export async function checkDokployAuth(request: Request) {
  const validation = await validateDokploySession(request);

  if (!validation.valid || !validation.orgId) {
    return null;
  }

  // Получаем или создаем Umami user для этой организации
  const umamiUser = await getOrCreateUmamiUserForOrg(validation.orgId);

  if (!umamiUser) {
    log('Failed to get or create Umami user for org:', validation.orgId);
    return null;
  }

  // Возвращаем в формате, совместимом с checkAuth
  return {
    token: null, // Не используем токен для Dokploy-авторизации
    authKey: null,
    shareToken: null,
    user: {
      ...umamiUser,
      isAdmin: umamiUser.role === ROLES.admin,
    },
    dokployOrgId: validation.orgId, // Дополнительная информация
  };
}
