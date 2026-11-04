export interface ProviderResponseMapping {
  /** The path(s) to the array of results in the JSON response (e.g., ["data.products", "items"]) */
  itemsKeys: string[];
  /** Possible object keys for the product title (e.g., ["product_title", "title", "name"]) */
  titleKeys: string[];
  /** Possible object keys for the product price (e.g., ["product_price", "price.current_price"]) */
  priceKeys: string[];
  /** Possible object keys for the product URL */
  urlKeys: string[];
  /** Possible object keys for the product image */
  imageKeys: string[];
  /** Optional: Possible object keys for the store name (useful for aggregator APIs like Google Lens) */
  storeKeys?: string[];
}

export interface RapidApiProvider {
  /** Unique identifier for this provider configuration (e.g., "amazon-real-time") */
  id: string;
  
  /** The generic store this represents (e.g., "Amazon", "Walmart", "Flipkart", "Google Lens") */
  store: string;
  
  /** Priority for fallback (1 is highest priority. If 1 fails, engine tries 2) */
  priority: number;
  
  /** The host domain of the RapidAPI service */
  host: string;
  
  /** The path endpoint (e.g., "/search") */
  endpoint: string;
  
  /** HTTP Method (GET, POST) */
  method: "GET" | "POST";
  
  /** Dictionary of query parameters. Use "{{query}}" as the placeholder for the user's search text. */
  queryParams: Record<string, string>;
  
  /** Dictionary of headers. The generic engine automatically attaches x-rapidapi-host and x-rapidapi-key */
  headers: Record<string, string>;
  
  /** The raw RapidAPI Key extracted directly from the user's snippet */
  apiKey: string;
  
  /** Maps the arbitrary JSON response structure to the normalized ProductResult shape */
  responseMapping: ProviderResponseMapping;
}
