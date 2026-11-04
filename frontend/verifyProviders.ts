import { searchStoreWithFallback } from './src/lib/providerEngine';

async function testAllProviders() {
  const query = "shoes";
  const providers = [
    'amazon',
    'amazonindia',
    'flipkart',
    'walmart',
    'quickcommerce',
    'meesho',
    'lensdata',
    'websearch',
    'chatgptvision'
  ];

  console.log("Starting Provider Verification...");

  for (const provider of providers) {
    console.log(`\n=================== ${provider.toUpperCase()} ===================`);
    try {
      const results = await searchStoreWithFallback(provider, query);
      if (results && results.length > 0) {
        console.log(`STATUS: WORKING (${results.length} results)`);
        console.log(JSON.stringify(results.slice(0, 2), null, 2));
      } else {
        console.log(`STATUS: FAILED / NO RESULTS`);
      }
    } catch (e: any) {
      console.log(`STATUS: CRASHED`);
      console.error(e.message);
    }
  }
}

testAllProviders();
