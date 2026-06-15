/**
 * Format currency to Indian standards (Lakh/Crore text conversion)
 */
export function formatIndianPrice(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return 'Price on Request';
  
  if (num >= 10000000) {
    const crores = num / 10000000;
    return `₹${crores.toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  
  if (num >= 100000) {
    const lakhs = num / 100000;
    return `₹${lakhs.toFixed(2).replace(/\.00$/, '')} Lakh`;
  }
  
  return `₹${num.toLocaleString('en-IN')}`;
}

/**
 * Capitalize first letters of words
 */
export function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
