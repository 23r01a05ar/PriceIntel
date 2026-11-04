const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('frontend/.env.local', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=\"?(.*?)\"?$/m)[1];
const supabaseKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=\"?(.*?)\"?$/m)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('--- PRODUCTS ---');
  const { data: products, error: e1 } = await supabase.from('products').select('*').limit(3);
  console.log(products, e1);

  console.log('--- PRICES ---');
  const { data: prices, error: e2 } = await supabase.from('prices').select('*').limit(3);
  console.log(prices, e2);
  
  console.log('--- PRICE ALERTS SCHEMA ---');
  const { data: alerts, error: e3 } = await supabase.from('price_alerts').select('*').limit(1);
  console.log(alerts, e3);
}
check();
