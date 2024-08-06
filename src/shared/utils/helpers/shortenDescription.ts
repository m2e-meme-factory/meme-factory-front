export const shortenDescription = (description: string, maxLength: number = 100): string => {
  if (description.length <= maxLength) {
    return description;
  }
  return description.substring(0, maxLength - 3) + '...';
};
