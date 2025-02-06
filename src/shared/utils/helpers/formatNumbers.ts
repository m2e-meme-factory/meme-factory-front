export function formatNumberWithSpaces(number: number | string): string {
  const num = typeof number === 'string' ? parseFloat(number) : number;

  if (isNaN(num)) {
    return '';
  }

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
