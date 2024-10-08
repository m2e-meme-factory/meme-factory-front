export const getSocialsNameByTaskId = (id: number): string => {
  switch (id) {
    case 1:
      return 'Our Website';
    case 2:
      return 'X';
    case 3:
      return 'TG';
    case 4:
      return 'YT';
    case 5:
      return 'TT';
    case 6:
      return 'IG';
    case 7:
      return 'Reddit';
    case 8:
      return 'Medium';
    case 9:
      return 'Discord';
    default:
      return 'Unknown';
  }
};
