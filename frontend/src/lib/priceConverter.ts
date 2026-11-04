export const USD_TO_INR_RATE = 83;

export function convertUsdToInr(usdPrice: number): number {
  return usdPrice * USD_TO_INR_RATE;
}

export function formatINR(usdPrice: number): string {
  const inrPrice = convertUsdToInr(usdPrice);
  
  // Format with commas for Indian Numbering System (e.g. 1,00,000)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inrPrice);
}

// Format a number directly without USD conversion, but localized in INR
export function formatINRDirect(inrPrice: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inrPrice);
}
