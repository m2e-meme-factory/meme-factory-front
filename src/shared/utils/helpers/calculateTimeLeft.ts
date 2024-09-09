export const calculateTimeLeft = (createdAt: string): number => {
  const createdAtDate = new Date(createdAt);
  const timerEndDate = new Date(createdAtDate.getTime() + 2 * 60 * 1000);
  const now = new Date();
  const differenceInMillis = timerEndDate.getTime() - now.getTime();
  return Math.max(0, Math.floor(differenceInMillis / 1000));
};
