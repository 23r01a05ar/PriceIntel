import { ProductResult, cleanPrice } from '@/lib/productSearch';
import { PROVIDER_REGISTRY, RAPIDAPI_KEY } from '@/config/providers';

interface DynamicProductItem {
  product_title?: string;
  title?: string;
  name?: string;
  product_price?: string | number;
  price?: { current_price?: string | number; value?: string | number } | string | number;
  product_url?: string;
  url?: string;
  link?: string;
  product_photo?: string;
  image?: string;
  thumbnail?: string;
  source?: string;
  source_domain?: string;
  [key: string]: unknown;
}

function extractProductsFromData(data: unknown): DynamicProductItem[] {
  if (Array.isArray(data)) {
    // Check if the array contains product-like objects
    if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
      const first = data[0] as DynamicProductItem;
      if (first.product_title || first.title || first.name) {
        return data as DynamicProductItem[];
      }
    }
  } else if (typeof data === 'object' && data !== null) {
    for (const key of Object.keys(data)) {
      const result = extractProductsFromData((data as Record<string, unknown>)[key]);
      if (result.length > 0) return result;
    }
  }
  return [];
}

export async function searchStoreWithFallback(store: string, query: string, page: number = 1, limit: number = 10): Promise<ProductResult[]> {
  const products: ProductResult[] = [];
  
  const providerKey = store.toLowerCase();
  const provider = PROVIDER_REGISTRY[providerKey];
  const apiKey = RAPIDAPI_KEY;

  console.log(`[ProviderEngine] Initiating search for store: "${store}", query: "${query}", page: ${page}, limit: ${limit}`);

  let dynamicSuccess = false;

  if (provider && provider.enabled && apiKey) {
    try {
      // Replace potential hardcoded path parameter (e.g. /search/shoes)
      let finalEndpoint = provider.endpoint;
      if (finalEndpoint.includes('shoes')) {
        finalEndpoint = finalEndpoint.replace('shoes', encodeURIComponent(query));
      }
      
      // Construct URL
      const url = new URL(`https://${provider.host}${finalEndpoint}`);
      
      // Add query parameters from config, replacing standard query markers
      if (provider.queryParams) {
        for (const [k, v] of Object.entries(provider.queryParams)) {
          // Replace string placeholders
          let mappedValue = v;
          if (typeof mappedValue === 'string') {
             mappedValue = mappedValue.replace('{query}', query).replace('{limit}', limit.toString()).replace('{page}', page.toString()).replace('{offset}', ((page - 1) * limit).toString());
          }
          
          // Legacy check for 'q' override
          if (k.toLowerCase() === 'q' || k.toLowerCase() === 'query' || k.toLowerCase() === 'url' || k.toLowerCase() === 'query_url') {
            if (v === "shoes" || v === "{query}") {
               url.searchParams.append(k, query);
               continue;
            }
          }
          url.searchParams.append(k, mappedValue);
        }
      }

      // If the config didn't have any query params but we know it's a search, append ?q= or ?query=
      if (!url.searchParams.has('q') && !url.searchParams.has('query') && !url.searchParams.has('url') && !url.searchParams.has('query_url')) {
        url.searchParams.append('q', query);
      }

      // Inject API Key
      const headers = { ...provider.headers };
      if ('x-rapidapi-key' in headers) {
        headers['x-rapidapi-key'] = apiKey;
      }

      const fetchOptions: RequestInit = {
        method: provider.method,
        headers
      };
      
      if (provider.payloadTemplate) {
        // If payload contains 'url=', we append the query
        if (provider.payloadTemplate.includes('url=')) {
          fetchOptions.body = `url=${encodeURIComponent(query)}`;
        } else {
          fetchOptions.body = provider.payloadTemplate;
        }
      }

        console.log(`[ProviderEngine][${store}] Requesting URL: ${url.toString()}`);
        const res = await fetch(url.toString(), fetchOptions);
        console.log(`[ProviderEngine][${store}] Response Status: ${res.status} ${res.statusText}`);

        if (res.ok) {
          const data = await res.json();
          console.log(`[ProviderEngine][${store}] Successfully received JSON response.`);
          
          const items = extractProductsFromData(data);
          console.log(`[ProviderEngine][${store}] Extracted ${items.length} products.`);
          
          for (const item of items) {
            const title = String(item.product_title || item.title || item.name || "");
            let priceValue: string | number | Record<string, unknown> | null = "Check Site";
            
            // Prioritize customer-facing sale/buybox prices over generic product_price
            if (item.buy_box_price !== undefined && item.buy_box_price !== null) {
              priceValue = item.buy_box_price as string | number;
            } else if (item.offer_price !== undefined && item.offer_price !== null) {
              priceValue = item.offer_price as string | number;
            } else if (item.sale_price !== undefined && item.sale_price !== null) {
              priceValue = item.sale_price as string | number;
            } else if (item.current_price !== undefined && item.current_price !== null) {
              priceValue = item.current_price as string | number;
            } else if (typeof item.price === 'object' && item.price !== null) {
              const pObj = item.price as Record<string, unknown>;
              priceValue = (pObj.current_price || pObj.buy_box_price || pObj.sale_price || pObj.value || "Check Site") as string | number;
            } else if (item.product_price !== undefined && item.product_price !== null) {
              priceValue = item.product_price as string | number;
            } else if (item.price !== undefined && item.price !== null) {
              priceValue = item.price as string | number;
            }
            
            const price = String(priceValue);
            
            const productUrl = String(item.product_url || item.url || item.link || "");
            const image = String(item.product_photo || item.image || item.thumbnail || "");
            const source = String(item.source || item.source_domain || store);
            
            if (!title) continue;

            products.push({
              store: source.charAt(0).toUpperCase() + source.slice(1),
              title,
              price,
              numeric_price: cleanPrice(price),
              url: productUrl,
              image
            });
            if (products.length >= 30) break;
          }
          
          if (products.length > 0) {
            dynamicSuccess = true;
          }
        } else {
          console.error(`Dynamic API Error for ${store}: ${res.status}`);
          console.error(`Response text: ${await res.text()}`);
        }
    } catch (e: unknown) {
      console.error(`Dynamic API Exception for ${store}:`, e);
    }
  }

  // FALLBACK TO LEGACY AMAZON IF REQUESTED AMAZON AND DYNAMIC FAILED
  if (!dynamicSuccess && store.toLowerCase() === 'amazon') {
    const key = RAPIDAPI_KEY;
    if (!key) return products;
    
    const host = 'real-time-amazon-data.p.rapidapi.com';
    const url = `https://${host}/search?query=${encodeURIComponent(query)}&page=${page}&country=US`;
    
    try {
      const res = await fetch(url, {
        headers: {
          'x-rapidapi-key': key,
          'x-rapidapi-host': host
        }
      });
      if (res.ok) {
        const data = (await res.json()) as { data?: { products?: DynamicProductItem[] } };
        const items = data.data?.products || [];
        for (const item of items) {
          products.push({
            store: 'Amazon',
            title: item.product_title || "",
            price: String(item.product_price || "Check Site"),
            numeric_price: cleanPrice(String(item.product_price || "0")),
            url: item.product_url || "",
            image: item.product_photo || ""
          });
          if (products.length >= 30) break;
        }
      } else {
        console.error(`Fallback Amazon API Error: ${res.status}`);
      }
    } catch (e: unknown) {
      console.error("Fallback Amazon Exception", e);
    }
  }

  return products;
}
