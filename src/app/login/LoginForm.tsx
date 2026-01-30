import {
  Column,
  Form,
  FormButtons,
  FormField,
  FormSubmitButton,
  Heading,
  Icon,
  PasswordField,
  Text,
  TextField,
} from '@umami/react-zen';
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { Logo } from '@/components/svg';
import { setClientAuthToken } from '@/lib/client';
import { setUser } from '@/store/app';

export function LoginForm() {
  const { formatMessage, labels, getErrorMessage } = useMessages();
  const router = useRouter();
  const { mutateAsync, error } = useUpdateQuery('/auth/login');

  const handleSubmit = async (data: any) => {
    await mutateAsync(data, {
      onSuccess: async ({ token, user }) => {
        setClientAuthToken(token);
        setUser(user);
        router.push('/');
      },
    });
  };

  // Показываем сообщение если Dokploy интеграция включена
  const dokployEnabled = process.env.DOKPLOY_ENABLED !== 'false';
  const dokployUrl = process.env.DOKPLOY_API_URL || 'http://localhost:3000';

  return (
    <Column justifyContent="center" alignItems="center" gap="6">
      <Icon size="lg">
        <Logo />
      </Icon>
      <Heading>umami</Heading>
      {dokployEnabled && (
        <Column
          alignItems="center"
          gap="2"
          padding="4"
          backgroundColor="warning"
          borderRadius
          maxWidth="400px"
        >
          <Text size="sm" weight="medium">
            Авторизация через Dokploy
          </Text>
          <Text size="sm" muted>
            Пожалуйста, войдите через{' '}
            <a href={dokployUrl} style={{ textDecoration: 'underline' }}>
              Dokploy
            </a>
          </Text>
        </Column>
      )}
      <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
        <FormField
          label={formatMessage(labels.username)}
          data-test="input-username"
          name="username"
          rules={{ required: formatMessage(labels.required) }}
        >
          <TextField autoComplete="username" />
        </FormField>

        <FormField
          label={formatMessage(labels.password)}
          data-test="input-password"
          name="password"
          rules={{ required: formatMessage(labels.required) }}
        >
          <PasswordField autoComplete="current-password" />
        </FormField>
        <FormButtons>
          <FormSubmitButton
            data-test="button-submit"
            variant="primary"
            style={{ flex: 1 }}
            isDisabled={false}
          >
            {formatMessage(labels.login)}
          </FormSubmitButton>
        </FormButtons>
      </Form>
    </Column>
  );
}
