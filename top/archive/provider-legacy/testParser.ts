import { API_SNIPPETS } from './src/config/apis/apiSnippets';
import { API_KEYS } from './src/config/apis/apiKeys';
import { parseSnippet } from './src/lib/snippetParser';

async function testAll() {
  const providers = Object.keys(API_KEYS);
  console.log("Providers detected in API_KEYS:", providers);
  
  const snippetProviders = Object.keys(API_SNIPPETS);
  console.log("Providers detected in API_SNIPPETS:", snippetProviders);

  let allMatch = true;
  for (const p of providers) {
    if (!snippetProviders.includes(p)) {
      console.log(`MISMATCH: ${p} missing in API_SNIPPETS`);
      allMatch = false;
    }
  }
  if (allMatch) console.log("Keys and Snippets match perfectly.\n");

  const results: any[] = [];

  for (const provider of providers) {
    const snippet = API_SNIPPETS[provider as keyof typeof API_SNIPPETS];
    console.log(`\n=================== ${provider.toUpperCase()} ===================`);
    
    if (snippet === undefined) {
      console.log(`STATUS: MISSING_PROVIDER (snippet is undefined)`);
      continue;
    }
    
    if (snippet.trim() === "") {
      console.log(`STATUS: MISSING_PROVIDER (snippet is empty placeholder)`);
      continue;
    }

    try {
      const parsed = parseSnippet(snippet);
      if (parsed) {
        console.log(`STATUS: PARSED SUCCESSFULLY`);
        console.log(`Host: ${parsed.host}`);
        console.log(`Endpoint: ${parsed.endpoint}`);
        console.log(`Method: ${parsed.method}`);
        console.log(`Headers: ${Object.keys(parsed.headers).length} found`);
        console.log(`QueryParams:`, parsed.queryParams);
        console.log(`Payload:`, parsed.body ? "Yes" : "No");
        
        results.push({ provider, parsed: true, ...parsed });
      } else {
        console.log(`STATUS: FAILED PARSING`);
        results.push({ provider, parsed: false });
      }
    } catch (e) {
      console.log(`STATUS: EXCEPTION DURING PARSING`);
      console.error(e);
      results.push({ provider, parsed: false, error: String(e) });
    }
  }
}

testAll().catch(console.error);
