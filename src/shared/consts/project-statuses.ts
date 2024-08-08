import { Option } from '../../@types/app';

export const PROJECT_STATUSES: Option[] = [
  {
    label: 'Draft',
    value: 'draft'
  },
  {
    label: 'Moderation',
    value: 'moderation'
  },
  {
    label: 'Published',
    value: 'published'
  },
  {
    label: 'Rejected',
    value: 'not_accepted'
  },
  {
    label: 'Closed',
    value: 'closed'
  },
]