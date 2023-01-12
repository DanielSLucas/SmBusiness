export function toLocaleDateString(dateTime: string) {
  const [date] = dateTime.split('T');

  return date.split('-').reverse().join('/');
}