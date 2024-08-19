export enum EventType {
  APPLICATION_SUBMITTED = 'APPLICATION_SUBMITTED',
  APPLICATION_APPROVED = 'APPLICATION_APPROVED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
  TASK_SUBMIT = 'TASK_SUBMIT',
  TASK_REJECTED = 'TASK_REJECTED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  DISPUTE_OPENED = 'DISPUTE_OPENED',
  DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',
  USER_MESSAGE = 'USER_MESSAGE',
}

export const getEventType = (eventType: EventType): 'success' | 'failure' | 'info' | 'message' => {
  switch (eventType) {
    case EventType.APPLICATION_SUBMITTED:
    case EventType.TASK_SUBMIT:
    case EventType.DISPUTE_OPENED:
    case EventType.DISPUTE_RESOLVED:
      return 'info';
    case EventType.APPLICATION_APPROVED:
    case EventType.TASK_COMPLETED:
      return 'success';
    case EventType.APPLICATION_REJECTED:
    case EventType.TASK_REJECTED:
      return 'failure';
    case EventType.USER_MESSAGE:
      return 'message';
    default:
      return 'info';
  }
};
