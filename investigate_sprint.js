const fs = require('fs');

const env = fs.readFileSync('frontend/.env.local', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=\"?(.*?)\"?$/m)[1];
const supabaseKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=\"?(.*?)\"?$/m)[1];
const rapidApiKey = env.match(/RAPIDAPI_KEY=\"?(.*?)\"?$/m)[1];

async function checkSupabase() {
  console.log('--- SUPABASE PRICE ALERTS SCHEMA ---');
  const res = await fetch(supabaseUrl + '/rest/v1/price_alerts?select=*&limit=1', {
    headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey }
  });
  console.log('Price Alerts Status:', res.status);
  const data = await res.json();
  console.log('Price Alerts Data/Schema:', data);
  
  console.log('\n--- SUPABASE PRICES SCHEMA ---');
  const resPrices = await fetch(supabaseUrl + '/rest/v1/prices?select=*&limit=1', {
    headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey }
  });
  console.log('Prices Data/Schema:', await resPrices.json());
}

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
    // We will just do a text search to lensdata endpoint or check its status
    const res = await fetch('https://lensdata.p.rapidapi.com/search?url=https://m.media-amazon.com/images/I/71c5W9NxN-L._AC_SL1500_.jpg', {
      headers: { 'x-rapidapi-host': 'lensdata.p.rapidapi.com', 'x-rapidapi-key': rapidApiKey }
    });
    console.log('LensData status:', res.status);
    const data = await res.text();
    console.log('Preview:', data.substring(0, 300));
  } catch (e) { console.log(e.message); }
}

async function run() {
  await checkSupabase();
  await testProviders();
}
run();
