import statistics
import re

def normalize_name(name):
    """
    Normalizes product names by removing special characters and extra spaces 
    to help in matching variations.
    """
    if not name: return ""
    return re.sub(r'[^a-zA-Z0-9\s]', '', name).lower().strip()

def calculate_deal_score(deal, min_price, max_price):
    """
    Implements a relative pricing scoring system considering price relative to the 
    bounds of the current search results and platform reputation.
    Higher scores are better (Scale 1-100).
    """
    price = deal.get('numeric_price', 0)
    if price <= 0: return 0.0
    
    # 1. Price Score Component (70% weight)
    # If all items have the same price or there is only one item, it gets full base price score
    if max_price == min_price:
        price_score = 100.0
    else:
        # Scale between 50 (worst price in set) and 100 (best price in set)
        price_score = 100.0 - 50.0 * ((price - min_price) / (max_price - min_price))
        
    # 2. Store Reputation Component (30% weight)
    # Reputation score out of 100
    reputation_score = {"Amazon": 100, "Walmart": 85, "Flipkart": 85}
    store_rep = reputation_score.get(deal.get('store'), 70)
    
    # 3. Aggregate Weighted Score
    score = (price_score * 0.70) + (store_rep * 0.30)
    
    return round(min(max(score, 0.0), 100.0), 2)

def compare_prices(all_deals):
    """
    Aggregates prices, calculates statistics, and returns structured results.
    """
    valid_deals = [d for d in all_deals if d.get('numeric_price', 0) > 0]
    
    if not valid_deals:
        return {
            "stats": {"lowest": 0, "highest": 0, "average": 0},
            "ranked_deals": []
        }

    prices = [d['numeric_price'] for d in valid_deals]
    min_price = min(prices)
    max_price = max(prices)
    
    # Calculate statistics 
    stats = {
        "lowest": min_price,
        "highest": max_price,
        "average": round(statistics.mean(prices), 2),
        "total_count": len(valid_deals)
    }

    # Process and rank each deal 
    processed_deals = []
    for deal in valid_deals:
        # Account for additional costs (mocked tax/shipping at 5%) 
        final_price = deal['numeric_price'] * 1.05 
        
        processed_deals.append({
            **deal,
            "final_estimated_price": round(final_price, 2),
            "deal_score": calculate_deal_score(deal, min_price, max_price),
            "normalized_title": normalize_name(deal['title'])
        })

    # Sort by deal score descending 
    ranked_deals = sorted(processed_deals, key=lambda x: x['deal_score'], reverse=True)

    return {
        "stats": stats,
        "ranked_deals": ranked_deals
    }