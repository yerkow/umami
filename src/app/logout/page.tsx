import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LogoutPage } from './LogoutPage';

export default function () {
  if (process.env.DISABLE_LOGIN || process.env.CLOUD_MODE) {
    return null;
  }

  // Если Dokploy интеграция включена, редиректим на главную
  // (Dokploy пользователи не могут выйти через Umami, только через Dokploy)
  if (process.env.DOKPLOY_ENABLED !== 'false') {
    redirect('/');
  }

  return <LogoutPage />;
}

export const metadata: Metadata = {
  title: 'Logout',
};
