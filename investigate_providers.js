const fs = require('fs');
const env = fs.readFileSync('frontend/.env.local', 'utf8');
const rapidApiKeyMatch = env.match(/RAPIDAPI_KEY=\"?(.*?)\"?$/m);
if (!rapidApiKeyMatch) {
  console.log('No RAPIDAPI_KEY found');
  process.exit(1);
}
const rapidApiKey = rapidApiKeyMatch[1];

async function testProviders() {
  console.log('\n--- PROVIDER TEST: RealTimeProductSearch ---');
  try {
    const res = await fetch('https://real-time-product-search.p.rapidapi.com/deals?q=laptop&limit=5', {
      headers: { 'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com', 'x-rapidapi-key': rapidApiKey }
    });
    console.log('RealTimeProductSearch status:', res.status);
    const data = await res.text();
    console.log('Preview:', data.substring(0, 200));
  } catch (e) { console.log(e.message); }

  console.log('\n--- PROVIDER TEST: Amazon ---');
  try {
    const res = await fetch('https://real-time-amazon-data.p.rapidapi.com/search?query=laptop&page=1&country=US', {
      headers: { 'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com', 'x-rapidapi-key': rapidApiKey }
    });
    console.log('Amazon status:', res.status);
    const data = await res.text();
    console.log('Preview:', data.substring(0, 200));
  } catch (e) { console.log(e.message); }

  console.log('\n--- PROVIDER TEST: Walmart ---');
  try {
    const res = await fetch('https://realtime-walmart-data.p.rapidapi.com/rollbacks?q=laptop&limit=5', {
      headers: { 'x-rapidapi-host': 'realtime-walmart-data.p.rapidapi.com', 'x-rapidapi-key': rapidApiKey }
    });
    console.log('Walmart status:', res.status);
    const data = await res.text();
    console.log('Preview:', data.substring(0, 200));
  } catch (e) { console.log(e.message); }
  
  console.log('\n--- PROVIDER TEST: LensData (Image Search) ---');
  try {
    const res = await fetch('https://lensdata.p.rapidapi.com/search?url=https://m.media-amazon.com/images/I/71c5W9NxN-L._AC_SL1500_.jpg', {
      headers: { 'x-rapidapi-host': 'lensdata.p.rapidapi.com', 'x-rapidapi-key': rapidApiKey }
    });
    console.log('LensData status:', res.status);
    const data = await res.text();
    console.log('Preview:', data.substring(0, 1000));
  } catch (e) { console.log(e.message); }
}

testProviders();
