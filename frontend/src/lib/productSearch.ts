
export interface ProductResult {
  store: string;
  title: string;
  price: string;
  numeric_price: number;
  url: string;
  image: string;
  product_id?: string;
  normalized_title?: string;
}

export function cleanPrice(priceStr: string | null | undefined): number {
  if (!priceStr || priceStr === "Check Site") return 0.0;
  
  // Handle ranges by extracting the first part before the hyphen or 'to'
  let targetStr = String(priceStr);
  if (targetStr.includes('-')) {
    targetStr = targetStr.split('-')[0];
  } else if (targetStr.toLowerCase().includes(' to ')) {
    targetStr = targetStr.toLowerCase().split(' to ')[0];
  }

  const cleaned = targetStr.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0.0 : parsed;
}
