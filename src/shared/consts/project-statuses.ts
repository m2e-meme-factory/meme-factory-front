import { Option } from '../../@types/app';

export enum ProjectStatus {
  DRAFT = 'draft',
  MODERATION = 'moderation',
  PUBLISHED = 'published',
  NOT_ACCEPTED = 'not_accepted',
  CLOSED = 'closed',
}

export const PROJECT_STATUSES: Option[] = [
  {
    label: 'Draft',
    value: ProjectStatus.DRAFT,
  },
  {
    label: 'Moderation',
    value: ProjectStatus.MODERATION,
  },
  {
    label: 'Published',
    value: ProjectStatus.PUBLISHED,
  },
  {
    label: 'Rejected',
    value: ProjectStatus.NOT_ACCEPTED,
  },
  {
    label: 'Closed',
    value: ProjectStatus.CLOSED,
  },
];
