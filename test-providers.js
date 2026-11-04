const fs = require('fs');

async function testApi(url, host) {
  try {
    const res = await fetch(url, {
      headers: {
        'x-rapidapi-host': host,
        'x-rapidapi-key': 'fb2b92412cmsh8e4041d5e17a96fp190184jsn15f3f7612335'
      }
    });
    console.log(host, res.status, res.statusText);
    const text = await res.text();
    console.log('Length:', text.length, 'Preview:', text.substring(0, 100).replace(/\n/g, ' '));
  } catch (e) {
    console.log(host, 'Error:', e.message);
  }
}

async function run() {
  await testApi('https://real-time-amazon-data.p.rapidapi.com/search?query=shoes', 'real-time-amazon-data.p.rapidapi.com');
  await testApi('https://amazon-india-web-scraper.p.rapidapi.com/search/shoes?api_key=5e807588161dda4445ec22b79036a4c0', 'amazon-india-web-scraper.p.rapidapi.com');
  await testApi('https://flipkart-apis.p.rapidapi.com/backend/rapidapi/category-products-list?categoryID=axc&page=1', 'flipkart-apis.p.rapidapi.com');
  await testApi('https://walmart-api4.p.rapidapi.com/search?q=shoes', 'walmart-api4.p.rapidapi.com');
  await testApi('https://real-time-lens-data.p.rapidapi.com/object-detection?url=https://thumbs.dreamstime.com/b/giraffe-zebra-1533191.jpg', 'real-time-lens-data.p.rapidapi.com');
}
run();
