import debug from 'debug';
import { ROLES } from '@/lib/constants';
import { uuid } from '@/lib/crypto';
import prisma from '@/lib/prisma';
import { createUser } from './user';

const log = debug('umami:dokploy-org');

/**
 * Получает или создает Umami user для Dokploy организации
 * Один Umami user = одна Dokploy организация
 */
export async function getOrCreateUmamiUserForOrg(
  dokployOrgId: string,
): Promise<{ id: string; username: string; role: string; createdAt: Date } | null> {
  try {
    // Ищем существующего пользователя по dokploy_org_id
    // Используем username в формате "dokploy_org_<org_id>" как временное решение
    // Или можно добавить отдельную таблицу маппинга
    const username = `dokploy_org_${dokployOrgId}`;

    let user = await prisma.client.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      // Создаем нового пользователя для этой организации
      // Пароль не нужен, так как авторизация через Dokploy
      const randomPassword = uuid(); // Генерируем случайный пароль, он не будет использоваться

      user = await createUser({
        id: uuid(),
        username,
        password: randomPassword, // Не используется, но поле обязательное
        role: ROLES.user, // Обычный пользователь, не admin
      });

      log(`Created Umami user for Dokploy org: ${dokployOrgId}`, user.id);
    }

    return user;
  } catch (error) {
    console.error('Error getting/creating Umami user for org:', dokployOrgId, error);
    return null;
  }
}

/**
 * Получает dokploy_org_id из username Umami user
 */
export function extractDokployOrgIdFromUsername(username: string): string | null {
  const match = username.match(/^dokploy_org_(.+)$/);
  return match ? match[1] : null;
}
