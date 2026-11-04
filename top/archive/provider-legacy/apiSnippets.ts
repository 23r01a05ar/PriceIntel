export interface ApiSnippetMap {
  [provider: string]: string;
}

export const API_SNIPPETS: ApiSnippetMap = {
  amazonindia: String.raw`
import http.client

conn = http.client.HTTPSConnection("amazon-india-web-scraper.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "<YOUR_RAPIDAPI_KEY_HERE>",
    'x-rapidapi-host': "amazon-india-web-scraper.p.rapidapi.com",
    'Content-Type': "application/json"
}

conn.request("GET", "/search/shoes?api_key=5e807588161dda4445ec22b79036a4c0", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
`,
  meesho: String.raw`
import http.client

conn = http.client.HTTPSConnection("meesho-price-history-tracker1.p.rapidapi.com")

payload = "url="

headers = {
    'x-rapidapi-key': "<YOUR_RAPIDAPI_KEY_HERE>",
    'x-rapidapi-host': "meesho-price-history-tracker1.p.rapidapi.com",
    'Content-Type': "application/x-www-form-urlencoded"
}

conn.request("POST", "/meesho.php", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
`,
  chatgptvision: String.raw`
import http.client

conn = http.client.HTTPSConnection("chatgpt-vision1.p.rapidapi.com")

payload = "{\"messages\":[{\"role\":\"user\",\"content\":[{\"type\":\"text\",\"text\":\"what's in the image\"},{\"type\":\"image\",\"url\":\"https://raw.githubusercontent.com/rphrp1985/mycodes/main/matagimage.png\"}]}],\"web_access\":false}"

headers = {
    'x-rapidapi-key': "<YOUR_RAPIDAPI_KEY_HERE>",
    'x-rapidapi-host': "chatgpt-vision1.p.rapidapi.com",
    'Content-Type': "application/json"
}

conn.request("POST", "/matagvision2", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
`,
  lensdata: String.raw`
import http.client

conn = http.client.HTTPSConnection("real-time-lens-data.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "<YOUR_RAPIDAPI_KEY_HERE>",
    'x-rapidapi-host': "real-time-lens-data.p.rapidapi.com",
    'Content-Type': "application/json"
}

conn.request("GET", "/object-detection?url=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fgiraffe-zebra-1533191.jpg", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
`,
  websearch: String.raw`
import http.client

conn = http.client.HTTPSConnection("real-time-web-search.p.rapidapi.com")

payload = "{\"queries\":[\"build a website\",\"nike shoes\",\"openweb ninja api\"],\"limit\":10}"

headers = {
    'x-rapidapi-key': "<YOUR_RAPIDAPI_KEY_HERE>",
    'x-rapidapi-host': "real-time-web-search.p.rapidapi.com",
    'Content-Type': "application/json"
}

conn.request("POST", "/search-light", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
`,
  flipkart: String.raw`
import http.client

conn = http.client.HTTPSConnection("flipkart-apis.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "<YOUR_RAPIDAPI_KEY_HERE>",
    'x-rapidapi-host': "flipkart-apis.p.rapidapi.com",
    'Content-Type': "application/json"
}

conn.request("GET", "/backend/rapidapi/category-products-list?categoryID=axc&page=1", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
`,
  walmart: String.raw`
import http.client

conn = http.client.HTTPSConnection("walmart-api4.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "<YOUR_RAPIDAPI_KEY_HERE>",
    'x-rapidapi-host': "walmart-api4.p.rapidapi.com",
    'Content-Type': "application/json"
}

conn.request("GET", "/search?q=shoes", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
`,
  amazon: String.raw``,
  quickcommerce: String.raw``,
};
