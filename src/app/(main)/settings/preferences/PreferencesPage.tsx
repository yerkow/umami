'use client';
import { Button, Column } from '@umami/react-zen';
import { useRouter } from 'next/navigation';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { useMessages } from '@/components/hooks';
import { ArrowLeft } from '@/components/icons';
import { PreferenceSettings } from './PreferenceSettings';

export function PreferencesPage() {
  const { formatMessage, labels } = useMessages();
  const router = useRouter();

  return (
    <PageBody>
      <Column gap="6">
        <PageHeader title={formatMessage(labels.preferences)}>
          <Button variant="secondary" onPress={() => router.back()} icon={<ArrowLeft />}>
            {formatMessage(labels.back)}
          </Button>
        </PageHeader>
        <Panel>
          <PreferenceSettings />
        </Panel>
      </Column>
    </PageBody>
  );
}
