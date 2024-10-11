export const getColorByType = (type: 'success' | 'failure' | 'info' | 'message'): string => {
  switch (type) {
    case 'success':
      return '#3E7949';
    case 'failure':
      return '#5E1C16';
    case 'info':
      return '#0573cf';
    case 'message':
    default:
      return 'var(--gray-2)';
  }
};
