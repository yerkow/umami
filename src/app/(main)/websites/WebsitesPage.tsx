'use client';
import { Column } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { useNavigation } from '@/components/hooks';
import { WebsitesDataTable } from './WebsitesDataTable';
import { WebsitesHeader } from './WebsitesHeader';

export function WebsitesPage() {
  const { teamId } = useNavigation();

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <WebsitesHeader />
        <Panel>
          <WebsitesDataTable teamId={teamId} />
        </Panel>
      </Column>
    </PageBody>
  );
}
