import {
  Row,
  Sidebar,
  SidebarItem,
  type SidebarProps,
  SidebarSection,
  ThemeButton,
} from '@umami/react-zen';
import Link from 'next/link';
import { useGlobalState, useMessages, useNavigation } from '@/components/hooks';
import { Globe, Grid2x2, LinkIcon, Settings } from '@/components/icons';
import { LanguageButton } from '@/components/input/LanguageButton';

export function SideNav(props: SidebarProps) {
  const { formatMessage, labels } = useMessages();
  const { pathname, renderUrl, websiteId } = useNavigation();
  const [isCollapsed, setIsCollapsed] = useGlobalState('sidenav-collapsed');

  const hasNav = !!(websiteId || pathname.startsWith('/admin') || pathname.includes('/settings'));

  const links = [
    {
      id: 'websites',
      label: formatMessage(labels.websites),
      path: '/websites',
      icon: <Globe />,
    },
    {
      id: 'links',
      label: formatMessage(labels.links),
      path: '/links',
      icon: <LinkIcon />,
    },
    {
      id: 'pixels',
      label: formatMessage(labels.pixels),
      path: '/pixels',
      icon: <Grid2x2 />,
    },
    {
      id: 'settings',
      label: formatMessage(labels.settings),
      path: '/settings',
      icon: <Settings />,
    },
  ];

  return (
    <Sidebar {...props} isCollapsed={isCollapsed || hasNav} backgroundColor>
      <SidebarSection flexGrow={1}>
        {links.map(({ id, path, label, icon }) => {
          return (
            <Link key={id} href={renderUrl(path, false)} role="button">
              <SidebarItem
                label={label}
                icon={icon}
                isSelected={pathname.includes(path)}
                role="button"
              />
            </Link>
          );
        })}
      </SidebarSection>
      <SidebarSection justifyContent="flex-start">
        <Row wrap="wrap">
          <LanguageButton />
          <ThemeButton />
        </Row>
      </SidebarSection>
    </Sidebar>
  );
}
