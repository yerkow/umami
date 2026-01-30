import { Row } from '@umami/react-zen';
import { PreferenceSettings } from '@/app/(main)/settings/preferences/PreferenceSettings';
import { PageHeader } from '@/components/common/PageHeader';
import { useMessages, useNavigation } from '@/components/hooks';
import { Settings } from '@/components/icons';
import { DialogButton } from '@/components/input/DialogButton';
import { WebsiteAddButton } from './WebsiteAddButton';

export interface WebsitesHeaderProps {
  allowCreate?: boolean;
}

export function WebsitesHeader({ allowCreate = true }: WebsitesHeaderProps) {
  const { formatMessage, labels } = useMessages();
  const { teamId } = useNavigation();

  return (
    <PageHeader title={formatMessage(labels.websites)}>
      <Row gap="2" alignItems="center">
        <DialogButton
          icon={<Settings />}
          label={formatMessage(labels.preferences)}
          title={formatMessage(labels.preferences)}
          variant="secondary"
          width="480px"
          minWidth="480px"
        >
          {() => <PreferenceSettings />}
        </DialogButton>
        {allowCreate && <WebsiteAddButton teamId={teamId} />}
      </Row>
    </PageHeader>
  );
}
