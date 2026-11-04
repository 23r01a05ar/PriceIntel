const fs = require('fs');

const key = 'fb2b92412cmsh8e4041d5e17a96fp190184jsn15f3f7612335';

async function testAmzIndia() {
  console.log('\n--- AMAZON INDIA ---');
  try {
    const res = await fetch('https://amazon-india-web-scraper.p.rapidapi.com/search/shoes?api_key=5e807588161dda4445ec22b79036a4c0', {
      headers: { 'x-rapidapi-host': 'amazon-india-web-scraper.p.rapidapi.com', 'x-rapidapi-key': key }
    });
    console.log('Status:', res.status, res.statusText);
    console.log('Headers:', Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log('Response body preview:', text.substring(0, 200));
  } catch (e) { console.log('Error:', e.message); }
}

async function testMeesho() {
  console.log('\n--- MEESHO ---');
  try {
    const params = new URLSearchParams();
    params.append('url', 'https://www.meesho.com/search?q=shoes');
    const res = await fetch('https://meesho-price-history-tracker1.p.rapidapi.com/meesho.php', {
      method: 'POST',
      headers: { 
        'x-rapidapi-host': 'meesho-price-history-tracker1.p.rapidapi.com', 
        'x-rapidapi-key': key,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    console.log('Status:', res.status, res.statusText);
    console.log('Headers:', Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log('Response body preview:', text.substring(0, 200));
  } catch (e) { console.log('Error:', e.message); }
}

async function run() {
  await testAmzIndia();
  await testMeesho();
}
run();
