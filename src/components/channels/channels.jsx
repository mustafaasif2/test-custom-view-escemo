import { useIntl } from 'react-intl';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import Constraints from '@commercetools-uikit/constraints';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import DataTable from '@commercetools-uikit/data-table';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { Pagination } from '@commercetools-uikit/pagination';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { PrimaryButton, SecondaryButton } from '@commercetools-uikit/buttons';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import {
  formatLocalizedString,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import { useChannelsFetcher } from '../../hooks/use-channels-connector';
import { getErrorMessage } from '../../helpers';
import messages from './messages';

const columns = [
  { key: 'name', label: 'Channel name' },
  { key: 'roles', label: 'Roles' },
];

const Channels = () => {
  const intl = useIntl();
  const user = useApplicationContext((context) => context.user);
  const dataLocale = useApplicationContext((context) => context.dataLocale);
  const projectLanguages = useApplicationContext(
    (context) => context.project?.languages
  );
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const { channelsPaginatedResult, error, loading } = useChannelsFetcher({
    page,
    perPage,
    tableSorting,
  });
  const showNotification = useShowNotification();

  const handleSuccessNotification = () => {
    showNotification({
      kind: NOTIFICATION_KINDS_SIDE.success,
      domain: DOMAINS.SIDE,
      text: 'Operation completed successfully! 🎉',
    });
  };

  const handleErrorNotification = () => {
    showNotification({
      kind: NOTIFICATION_KINDS_SIDE.error,
      domain: DOMAINS.SIDE,
      text: 'An error occurred! Please try again. ⚠️',
    });
  };

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }

  if (!loading && channelsPaginatedResult?.total < 1) {
    return (
      <ContentNotification type="info">
        <Text.Body intlMessage={messages.noResults} />
      </ContentNotification>
    );
  }

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="s">
        <Text.Headline as="h2" intlMessage={messages.title} />
        <Text.Subheadline as="h4">
          {intl.formatMessage(messages.subtitle, {
            firstName: user?.firstName,
            lastName: user?.lastName,
          })}
        </Text.Subheadline>
      </Spacings.Stack>

      <Spacings.Inline>
        <PrimaryButton
          label="Show Success Notification"
          onClick={handleSuccessNotification}
        />
        <SecondaryButton
          label="Show Error Notification"
          onClick={handleErrorNotification}
        />
      </Spacings.Inline>

      {loading && <LoadingSpinner />}

      {channelsPaginatedResult ? (
        <Spacings.Stack scale="l">
          <DataTable
            isCondensed
            columns={columns}
            rows={channelsPaginatedResult.results}
            itemRenderer={(item, column) => {
              switch (column.key) {
                case 'roles':
                  return item.roles.join(', ');
                case 'name':
                  return formatLocalizedString(
                    {
                      name: transformLocalizedFieldToLocalizedString(
                        item.nameAllLocales ?? []
                      ),
                    },
                    {
                      key: 'name',
                      locale: dataLocale,
                      fallbackOrder: projectLanguages,
                      fallback: NO_VALUE_FALLBACK,
                    }
                  );
                default:
                  return null;
              }
            }}
            sortedBy={tableSorting.value.key}
            sortDirection={tableSorting.value.order}
            onSortChange={tableSorting.onChange}
          />
          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={channelsPaginatedResult.total}
          />
        </Spacings.Stack>
      ) : null}
    </Spacings.Stack>
  );
};
Channels.displayName = 'Channels';

export default Channels;
