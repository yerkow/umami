/**
 * Утилиты для работы с Dokploy интеграцией
 */

/**
 * Проверяет, является ли пользователь Dokploy пользователем
 * Dokploy пользователи имеют username формата "dokploy_org_<org_id>"
 */
export function isDokployUser(user: { username?: string } | null | undefined): boolean {
  if (!user?.username) {
    return false;
  }
  return user.username.startsWith('dokploy_org_');
}

/**
 * Извлекает org_id из username Dokploy пользователя
 */
export function getDokployOrgId(user: { username?: string } | null | undefined): string | null {
  if (!isDokployUser(user)) {
    return null;
  }
  const match = user.username?.match(/^dokploy_org_(.+)$/);
  return match ? match[1] : null;
}
