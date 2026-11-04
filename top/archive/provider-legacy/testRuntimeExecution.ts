import { searchStoreWithFallback } from './src/lib/providerEngine';
import { API_SNIPPETS } from './src/config/apis/apiSnippets';
import { parseSnippet } from './src/lib/snippetParser';

async function testRuntimeExecution() {
  const query = "shoes";
  const providers = Object.keys(API_SNIPPETS);
  
  for (const provider of providers) {
    console.log(`\nTesting runtime for provider: ${provider}`);
    const snippet = API_SNIPPETS[provider as keyof typeof API_SNIPPETS];
    
    let host = "N/A", endpoint = "N/A", method = "N/A";
    
    if (snippet && snippet.trim() !== "") {
       const parsed = parseSnippet(snippet);
       if (parsed) {
         host = parsed.host;
         endpoint = parsed.endpoint;
         method = parsed.method;
       }
    } else if (provider === 'amazon') {
       host = "real-time-amazon-data.p.rapidapi.com (Fallback)";
       endpoint = "/search";
       method = "GET";
    }

    try {
      const results = await searchStoreWithFallback(provider, query);
      
      console.log(`Provider: ${provider}`);
      console.log(`Host: ${host}`);
      console.log(`Endpoint: ${endpoint}`);
      console.log(`Method: ${method}`);
      
      if (results.length > 0) {
        console.log(`Status: Working (${results.length} results returned)`);
      } else {
        console.log(`Status: Failed / No Results`);
      }
    } catch (e) {
      console.log(`Status: Failed (Exception)`);
      console.error(e);
    }
  }
}

testRuntimeExecution().catch(console.error);
