import { Option } from '../../@types/app';

enum ApplicationStatuses {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export const APPLICATION_STATUSES: Option[] = [
  {
    label: 'Pending',
    value: ApplicationStatuses.PENDING,
  },
  {
    label: 'Accepted',
    value: ApplicationStatuses.ACCEPTED,
  },
  {
    label: 'Rejected',
    value: ApplicationStatuses.REJECTED,
  },
];
