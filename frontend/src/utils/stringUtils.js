export const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase()
    .split('_') // Handles cases like 'DINING_OUT'
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '); // Joins them with a space
};