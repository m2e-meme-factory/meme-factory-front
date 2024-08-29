import { Event } from 'api';
import { showErrorMessage } from './notify';

export const isApplicationUnsubmitted = (events: Event[], targetEvent: Event): boolean => {
  const targetIndex = events.findIndex((event) => event.id === targetEvent.id);

  if (targetIndex === -1) {
    showErrorMessage('Event was not found in the list');
  }

  for (let i = targetIndex + 1; i < events.length; i++) {
    const event = events[i];
    if (event.eventType === 'APPLICATION_REJECTED' || event.eventType === 'APPLICATION_APPROVED') {
      return false;
    }
  }

  return true;
};
