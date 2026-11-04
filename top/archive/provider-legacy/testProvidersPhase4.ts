import { searchStoreWithFallback } from './src/lib/providerEngine';
import { API_SNIPPETS } from './src/config/apis/apiSnippets';

async function testAllProviders() {
  const query = "shoes";
  const providers = Object.keys(API_SNIPPETS);
  
  for (const provider of providers) {
    console.log(`\nTesting provider: ${provider}`);
    try {
      const results = await searchStoreWithFallback(provider, query);
      console.log(`Result count: ${results.length}`);
      if (results.length > 0) {
        console.log(`Sample:`, results[0]);
      } else {
        console.log(`No results returned for ${provider}.`);
      }
    } catch (e) {
      console.error(`Error testing ${provider}:`, e);
    }
  }
}

testAllProviders().then(() => console.log('Done'));
