
export function generateUIN(gender: string, area: string): string {
  const prefix = gender === 'Female' ? 'V' : 'M';
  const areaCode = area.substring(0, 1).toUpperCase();
  const randomId = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${areaCode}-${randomId}`;
}
