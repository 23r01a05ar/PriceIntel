import { ProductResult } from "./productSearch";

export interface RankedDeal extends ProductResult {
  final_estimated_price: number;
  deal_score: number;
  normalized_title: string;
}

export interface ComparisonStats {
  lowest: number;
  highest: number;
  average: number;
  total_count: number;
}

export interface ComparisonResult {
  stats: ComparisonStats;
  ranked_deals: RankedDeal[];
}

export function normalizeName(name: string | null | undefined): string {
  if (!name) return "";
  return name.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
}

export function calculateDealScore(deal: ProductResult, minPrice: number, maxPrice: number): number {
  const price = deal.numeric_price || 0;
  if (price <= 0) return 0.0;
  
  let priceScore = 0.0;
  if (maxPrice === minPrice) {
    priceScore = 100.0;
  } else {
    priceScore = 100.0 - 50.0 * ((price - minPrice) / (maxPrice - minPrice));
  }
  
  const reputationScores: Record<string, number> = {
    "amazon": 100,
    "walmart": 85,
    "flipkart": 85
  };
  
  const storeRep = reputationScores[deal.store.toLowerCase()] || 70;
  let score = (priceScore * 0.70) + (storeRep * 0.30);
  
  score = Math.max(0.0, Math.min(score, 100.0));
  return Math.round(score * 100) / 100;
}

export function comparePrices(allDeals: ProductResult[]): ComparisonResult {
  const validDeals = allDeals.filter(d => (d.numeric_price || 0) > 0);
  
  if (validDeals.length === 0) {
    return {
      stats: { lowest: 0, highest: 0, average: 0, total_count: 0 },
      ranked_deals: []
    };
  }
  
  const prices = validDeals.map(d => d.numeric_price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  
  const stats: ComparisonStats = {
    lowest: minPrice,
    highest: maxPrice,
    average: Math.round(avgPrice * 100) / 100,
    total_count: validDeals.length
  };
  
  const processedDeals: RankedDeal[] = validDeals.map(deal => {
    const finalPrice = deal.numeric_price * 1.05;
    return {
      ...deal,
      final_estimated_price: Math.round(finalPrice * 100) / 100,
      deal_score: calculateDealScore(deal, minPrice, maxPrice),
      normalized_title: normalizeName(deal.title)
    };
  });
  
  const rankedDeals = processedDeals.sort((a, b) => b.deal_score - a.deal_score);
  
  return { stats, ranked_deals: rankedDeals };
}
