import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LoginPage } from './LoginPage';

export default async function () {
  if (process.env.DISABLE_LOGIN || process.env.CLOUD_MODE) {
    return null;
  }

  // Если Dokploy интеграция включена, редиректим на главную
  // (пользователи должны авторизоваться через Dokploy)
  if (process.env.DOKPLOY_ENABLED !== 'false') {
    redirect('/');
  }

  return <LoginPage />;
}

export const metadata: Metadata = {
  title: 'Login',
};
