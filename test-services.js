#!/usr/bin/env node

// Simple test script to verify all services are running
const http = require('http');

const services = [
  { name: 'API', url: 'http://localhost:3002', path: '/api/auth/me' },
  { name: 'WebApp', url: 'http://localhost:3001', path: '/' },
  { name: 'Website', url: 'http://localhost:3000', path: '/' }
];

async function testService(service) {
  return new Promise((resolve) => {
    const url = service.url + service.path;
    const req = http.get(url, (res) => {
      resolve({
        name: service.name,
        status: 'Running',
        statusCode: res.statusCode,
        url: service.url
      });
    });

    req.on('error', (err) => {
      resolve({
        name: service.name,
        status: 'Error',
        error: err.message,
        url: service.url
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        name: service.name,
        status: 'Timeout',
        url: service.url
      });
    });
  });
}

async function main() {
  console.log('🔍 Testing Solviser Services...\n');
  
  for (const service of services) {
    const result = await testService(service);
    const status = result.status === 'Running' ? '✅' : '❌';
    console.log(`${status} ${result.name}: ${result.status} ${result.statusCode ? `(${result.statusCode})` : ''}`);
    console.log(`   📍 ${result.url}`);
    if (result.error) {
      console.log(`   ⚠️  ${result.error}`);
    }
    console.log('');
  }

  console.log('🎉 Service check completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Open http://localhost:3000 (Website) - Public site with signin');
  console.log('2. Open http://localhost:3001 (WebApp) - Admin dashboard'); 
  console.log('3. API is running on http://localhost:3002');
  console.log('\n💡 Development Mode Notes:');
  console.log('- Authentication is bypassed in development mode');
  console.log('- Mock user data is provided for testing');
  console.log('- Database uses SQLite for easy setup');
}

main().catch(console.error);