'use client';
import { Column, Grid, Loading } from '@umami/react-zen';
import Script from 'next/script';
import { useEffect } from 'react';
import { useConfig, useLoginQuery, useNavigation } from '@/components/hooks';
import { LAST_TEAM_CONFIG } from '@/lib/constants';
import { removeItem, setItem } from '@/lib/storage';
import { UpdateNotice } from './UpdateNotice';

const DOKPLOY_ENABLED = process.env.DOKPLOY_ENABLED !== 'false';
const DOKPLOY_BASE_URL = process.env.DOKPLOY_API_URL || 'http://localhost:3000';

export function App({ children }) {
  const { user, isLoading, error } = useLoginQuery();
  const config = useConfig();
  const { pathname, teamId } = useNavigation();

  useEffect(() => {
    if (teamId) {
      setItem(LAST_TEAM_CONFIG, teamId);
    } else {
      removeItem(LAST_TEAM_CONFIG);
    }
  }, [teamId]);

  if (isLoading || !config) {
    return <Loading placement="absolute" />;
  }

  if (error) {
    // Если Dokploy интеграция включена, редиректим обратно в Dokploy
    // вместо страницы логина Umami
    if (DOKPLOY_ENABLED) {
      window.location.href = DOKPLOY_BASE_URL;
      return null;
    }

    window.location.href = config.cloudMode
      ? `${process.env.cloudUrl}/login`
      : `${process.env.basePath || ''}/login`;
    return null;
  }

  if (!user || !config) {
    return null;
  }

  return (
    <Grid columns="1fr" rows="1fr" height={{ xs: 'auto', lg: '100vh' }} width="100%">
      <Column alignItems="center" overflowY="auto" overflowX="hidden" position="relative">
        {children}
      </Column>
      <UpdateNotice user={user} config={config} />
      {process.env.NODE_ENV === 'production' &&
        !pathname.includes('/share/') &&
        process.env.DISABLE_TELEMETRY !== 'true' &&
        process.env.DOKPLOY_ENABLED === 'false' && (
          <Script src={`${process.env.basePath || ''}/telemetry.js`} />
        )}
    </Grid>
  );
}
