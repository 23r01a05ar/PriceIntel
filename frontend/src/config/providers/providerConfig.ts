import { ProviderConfig } from './providerTypes';

export const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";

export const chatgptvision: ProviderConfig = {
  id: "chatgptvision",
  host: "chatgpt-vision1.p.rapidapi.com",
  method: "POST",
  endpoint: "/matagvision2",
  headers: { "Content-Type": "application/json" },
  payloadTemplate: JSON.stringify({
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "what's in the image" },
          { type: "image", url: "https://raw.githubusercontent.com/rphrp1985/mycodes/main/matagimage.png" }
        ]
      }
    ],
    web_access: false
  }),
  enabled: true
};

export const lensdata: ProviderConfig = {
  id: "lensdata",
  host: "real-time-lens-data.p.rapidapi.com",
  method: "GET",
  endpoint: "/object-detection",
  headers: { "Content-Type": "application/json" },
  queryParams: { url: "https://thumbs.dreamstime.com/b/giraffe-zebra-1533191.jpg" },
  enabled: true
};

export const websearch: ProviderConfig = {
  id: "websearch",
  host: "real-time-web-search.p.rapidapi.com",
  method: "POST",
  endpoint: "/search-light",
  headers: { "Content-Type": "application/json" },
  payloadTemplate: JSON.stringify({ queries: ["build a website", "nike shoes", "openweb ninja api"], limit: 10 }),
  enabled: true
};

export const flipkart: ProviderConfig = {
  id: "flipkart",
  host: "real-time-flipkart.p.rapidapi.com",
  method: "GET",
  endpoint: "/search.php",
  headers: { "Content-Type": "application/json" },
  queryParams: { query: "{query}", page: "{page}", sort: "relevance" },
  enabled: true
};

export const walmart: ProviderConfig = {
  id: "walmart",
  host: "axesso-walmart-data-service.p.rapidapi.com",
  method: "GET",
  endpoint: "/wlm/walmart-search-by-keyword",
  headers: { "Content-Type": "application/json" },
  queryParams: { keyword: "{query}", page: "{page}", sortBy: "best_match" },
  enabled: true
};

// Explicitly define Amazon as disabled or fallback provider
export const amazon: ProviderConfig = {
  id: "amazon",
  host: "real-time-amazon-data.p.rapidapi.com", // Found from providerEngine fallback logic
  method: "GET",
  endpoint: "/search",
  headers: { "Content-Type": "application/json" },
  enabled: false // Trigger dynamic fallback in engine
};

export const realtimeproductsearch: ProviderConfig = {
  id: "realtimeproductsearch",
  host: "real-time-product-search.p.rapidapi.com",
  method: "GET",
  endpoint: "/deals",
  headers: { "Content-Type": "application/json" },
  queryParams: { q: "{query}", limit: "{limit}", offset: "{offset}" },
  enabled: true
};
