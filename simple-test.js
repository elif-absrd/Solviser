const http = require('http');

console.log('Testing API connection...');

const req = http.get('http://localhost:3002/api/auth/me', (res) => {
  console.log(`✅ API responding! Status: ${res.statusCode}`);
  res.on('data', chunk => {
    console.log('Response:', chunk.toString());
  });
}).on('error', (err) => {
  console.log('❌ API connection failed:', err.message);
});

// Also test a simple health check
setTimeout(() => {
  const healthReq = http.get('http://localhost:3002/', (res) => {
    console.log(`✅ Health check! Status: ${res.statusCode}`);
    res.on('data', chunk => {
      console.log('Health response:', chunk.toString());
    });
  }).on('error', (err) => {
    console.log('❌ Health check failed:', err.message);
  });
}, 1000);