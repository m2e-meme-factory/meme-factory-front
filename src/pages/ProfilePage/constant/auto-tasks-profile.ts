

import { AutoTaskType } from '../model/auto-task';

import { LOCAL_TEXT } from '@shared/consts';
import { CATEGORY_TASKS } from '@shared/consts/category-tasks';

export const AUTO_TASKS_PROFILE: AutoTaskType[] = [
  {
    title: LOCAL_TEXT.READ_PITCHDECK,
    description: LOCAL_TEXT.WEBURL_TASK_DESCRIPTION,   
    category: CATEGORY_TASKS.OPEN_PITCHDEK,
    webUrl: 'https://drive.google.com/file/d/1xN3bkArwN17_wCTOgFgA9jnBDrwJzuoe/view?usp=drive_link',
  },
  {
    title: LOCAL_TEXT.READ_WHITEPAPER,
    description: LOCAL_TEXT.WEBURL_TASK_DESCRIPTION,    
    category: CATEGORY_TASKS.OPEN_WHITEPAPER,
    webUrl: 'https://drive.google.com/file/d/18zlq7Dn5gnXQImlNmQfwZAiyRFYcFULJ/view?usp=drive_link',
  },
];

