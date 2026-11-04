const fs = require('fs');

const env = fs.readFileSync('frontend/.env.local', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=\"?(.*?)\"?$/m)[1];
const supabaseAnonKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=\"?(.*?)\"?$/m)[1];

async function checkSupabase() {
  console.log('--- SUPABASE PRICE ALERTS SCHEMA ---');
  const res = await fetch(supabaseUrl + '/rest/v1/price_alerts?select=*&limit=1', {
    headers: { 'apikey': supabaseAnonKey, 'Authorization': 'Bearer ' + supabaseAnonKey }
  });
  console.log('Price Alerts Status:', res.status);
  const data = await res.text();
  console.log('Price Alerts Data/Schema:', data);
  
  console.log('\n--- SUPABASE PRICES SCHEMA ---');
  const resPrices = await fetch(supabaseUrl + '/rest/v1/prices?select=*&limit=1', {
    headers: { 'apikey': supabaseAnonKey, 'Authorization': 'Bearer ' + supabaseAnonKey }
  });
  console.log('Prices Data/Schema:', await resPrices.text());
}

checkSupabase();
