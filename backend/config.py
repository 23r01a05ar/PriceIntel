import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Amazon API Configuration
AMAZON_KEY = os.getenv("AMAZON_API_KEY", os.getenv("RAPIDAPI_KEY"))
AMAZON_HOST = os.getenv("AMAZON_API_HOST", "real-time-amazon-data.p.rapidapi.com")

# Walmart Configuration
WALMART_KEY = os.getenv("WALMART_API_KEY", os.getenv("RAPIDAPI_KEY"))
WALMART_HOST = os.getenv("WALMART_API_HOST", "real-time-walmart-product-data-api.p.rapidapi.com")

# Flipkart Configuration
FLIPKART_KEY = os.getenv("FLIPKART_API_KEY", os.getenv("RAPIDAPI_KEY"))
FLIPKART_HOST = os.getenv("FLIPKART_API_HOST", "real-time-flipkart-data2.p.rapidapi.com")

# Database Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", 'sqlite:///' + os.path.join(BASE_DIR, 'price_intelligence.db'))
SQLALCHEMY_TRACK_MODIFICATIONS = False