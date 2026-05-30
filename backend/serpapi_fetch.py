import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("SERPAPI_KEY")

def search_product(product_name):
    url = "https://serpapi.com/search.json"
    
    params = {
        "q": product_name,
        "tbm": "shop",
        "api_key": API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    results = []
    for item in data.get("shopping_results", []):
        results.append({
            "source": "SerpAPI",
            "title": item.get("title"),
            "price": item.get("price"),
            "link": item.get("link")
        })

    return results


if __name__ == "__main__":
    products = search_product("laptop")

    for p in products[:5]:
        print(p)