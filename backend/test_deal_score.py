import sys
import os

# Add backend to python path
sys.path.insert(0, os.path.dirname(__file__))

from comparison_engine import compare_prices

def run_tests():
    print("[*] Starting validation tests for TASK_010: Fix deal score algorithm...")

    # Test Case 1: Standard low-price comparison
    print("\n[-] Test Case 1: Low-price items ($10, $15, $20) with store reputations")
    deals = [
        {"store": "Amazon", "numeric_price": 10.00, "title": "Product A"},
        {"store": "Walmart", "numeric_price": 15.00, "title": "Product A"},
        {"store": "Flipkart", "numeric_price": 20.00, "title": "Product A"},
    ]
    results = compare_prices(deals)
    ranked = results["ranked_deals"]

    # Amazon is cheapest ($10) and has 100 reputation -> total score should be 100.0
    assert ranked[0]["store"] == "Amazon"
    assert ranked[0]["deal_score"] == 100.0, f"Cheapest Amazon item should get 100.0, got {ranked[0]['deal_score']}"

    # Walmart is middle ($15) and has 85 reputation -> price score = 75, total score = (75*0.7) + (85*0.3) = 52.5 + 25.5 = 78.0
    assert ranked[1]["store"] == "Walmart"
    assert ranked[1]["deal_score"] == 78.0, f"Walmart should get 78.0, got {ranked[1]['deal_score']}"

    # Flipkart is most expensive ($20) and has 85 reputation -> price score = 50, total = (50*0.7) + (85*0.3) = 35 + 25.5 = 60.5
    assert ranked[2]["store"] == "Flipkart"
    assert ranked[2]["deal_score"] == 60.5, f"Flipkart should get 60.5, got {ranked[2]['deal_score']}"
    print("[+] Test Case 1 passed!")

    # Test Case 2: High-price items scaling ($1000, $1500, $2000)
    print("\n[-] Test Case 2: High-price items scaling ($1000, $1500, $2000)")
    high_deals = [
        {"store": "Amazon", "numeric_price": 1000.00, "title": "Ultra Laptop"},
        {"store": "Walmart", "numeric_price": 1500.00, "title": "Ultra Laptop"},
        {"store": "Flipkart", "numeric_price": 2000.00, "title": "Ultra Laptop"},
    ]
    high_results = compare_prices(high_deals)
    high_ranked = high_results["ranked_deals"]

    # Scores should scale perfectly and stay within [0, 100.0] without breaking or going negative
    assert high_ranked[0]["store"] == "Amazon"
    assert high_ranked[0]["deal_score"] == 100.0
    assert high_ranked[1]["store"] == "Walmart"
    assert high_ranked[1]["deal_score"] == 78.0
    assert high_ranked[2]["store"] == "Flipkart"
    assert high_ranked[2]["deal_score"] == 60.5
    print("[+] Test Case 2 passed!")

    # Test Case 3: Reputation ranking influence at same price points
    print("\n[-] Test Case 3: Reputation influence at identical prices ($100)")
    same_price_deals = [
        {"store": "Flipkart", "numeric_price": 100.00, "title": "Product B"},
        {"store": "Amazon", "numeric_price": 100.00, "title": "Product B"},
        {"store": "Walmart", "numeric_price": 100.00, "title": "Product B"},
    ]
    same_results = compare_prices(same_price_deals)
    same_ranked = same_results["ranked_deals"]

    # Prices are identical, so all get price_score = 100.0. Rank should be determined strictly by store reputation: Amazon (100) > Walmart (85) == Flipkart (85)
    assert same_ranked[0]["store"] == "Amazon"
    assert same_ranked[0]["deal_score"] == 100.0, f"Amazon should get 100.0, got {same_ranked[0]['deal_score']}"
    assert same_ranked[1]["store"] in ["Walmart", "Flipkart"]
    assert same_ranked[1]["deal_score"] == 95.5, f"Walmart/Flipkart should get 95.5, got {same_ranked[1]['deal_score']}"
    assert same_ranked[2]["store"] in ["Walmart", "Flipkart"]
    assert same_ranked[2]["deal_score"] == 95.5, f"Walmart/Flipkart should get 95.5, got {same_ranked[2]['deal_score']}"
    print("[+] Test Case 3 passed!")

    # Test Case 4: Single item edge case
    print("\n[-] Test Case 4: Single-item bounds handling")
    single_deal = [{"store": "Amazon", "numeric_price": 49.99, "title": "Solo Product"}]
    single_results = compare_prices(single_deal)
    single_ranked = single_results["ranked_deals"]

    assert len(single_ranked) == 1
    assert single_ranked[0]["deal_score"] == 100.0, "Single item should get full score of 100.0"
    print("[+] Test Case 4 passed!")

    print("\n[***] ALL TEST CASES PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
