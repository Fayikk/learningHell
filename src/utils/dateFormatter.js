/**
 * Formats a date string into a more readable format
 * @param {string} dateString - The ISO date string to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Belirtilmemiş';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', options);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};
