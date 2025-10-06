const http = require('http');

console.log('Testing API health endpoint...');

const req = http.get('http://localhost:3002/api/health', (res) => {
  console.log(`✅ API Health responding! Status: ${res.statusCode}`);
  res.on('data', chunk => {
    console.log('Health response:', chunk.toString());
  });
}).on('error', (err) => {
  console.log('❌ API health check failed:', err.message);
});

// Test direct root
setTimeout(() => {
  const rootReq = http.get('http://localhost:3002/', (res) => {
    console.log(`✅ Root endpoint! Status: ${res.statusCode}`);
    res.on('data', chunk => {
      console.log('Root response:', chunk.toString());
    });
  }).on('error', (err) => {
    console.log('❌ Root endpoint failed:', err.message);
  });
}, 1000);