import { AutoTaskType } from '../model/auto-task';

import { LOCAL_TEXT } from '@shared/consts';
import { CATEGORY_TASKS } from '@shared/consts/category-tasks';

export const AUTO_TASKS_PROFILE: AutoTaskType[] = [
  {
    title: LOCAL_TEXT.READ_PITCHDECK,
    description: LOCAL_TEXT.WEBURL_TASK_DESCRIPTION,
    category: CATEGORY_TASKS.OPEN_PITCHDEK,
    webUrl: 'https://drive.google.com/file/d/1qqRx5zk_HV8K4N9LEugeufRe0P986a06/view?usp=drive_link',
    webUrlRu:
      'https://drive.google.com/file/d/1lu9PQHNb575Enm53fQ2fFCJgkLBd6Xor/view?usp=drive_link',
  },
  {
    title: LOCAL_TEXT.READ_WHITEPAPER,
    description: LOCAL_TEXT.WEBURL_TASK_DESCRIPTION,
    category: CATEGORY_TASKS.OPEN_WHITEPAPER,
    webUrl: 'https://drive.google.com/file/d/1k794qLBbZmpU8d_8WXRfVHNALbOMErwc/view?usp=drive_link',
    webUrlRu:
      'https://drive.google.com/file/d/1dGIxQcN7TWOCP51GLVjW8IuR1SCRJOpL/view?usp=drive_link',
  },
];
