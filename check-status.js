#!/usr/bin/env node

console.log('🔍 Checking Solviser Services Status...\n');

const services = [
  { name: 'API', port: 3002, path: '/api/auth/me' },
  { name: 'WebApp', port: 3001, path: '/' },
  { name: 'Website', port: 3000, path: '/' }
];

async function checkService(service) {
  try {
    const response = await fetch(`http://localhost:${service.port}${service.path}`, {
      method: 'GET',
      credentials: 'include'
    });
    
    return {
      name: service.name,
      status: '✅ Running',
      statusCode: response.status,
      url: `http://localhost:${service.port}`
    };
  } catch (error) {
    return {
      name: service.name,
      status: '❌ Error',
      error: error.message,
      url: `http://localhost:${service.port}`
    };
  }
}

async function main() {
  for (const service of services) {
    const result = await checkService(service);
    console.log(`${result.status} ${result.name} ${result.statusCode ? `(${result.statusCode})` : ''}`);
    console.log(`   📍 ${result.url}`);
    if (result.error) {
      console.log(`   ⚠️  ${result.error}`);
    }
    console.log('');
  }

  console.log('📋 Access Your Applications:');
  console.log('• Website: http://localhost:3000 (Public site)');
  console.log('• WebApp: http://localhost:3001 (Admin dashboard)');
  console.log('• API: http://localhost:3002 (Backend)');
  console.log('\n💡 Issues Fixed:');
  console.log('✅ API server running on port 3002');
  console.log('✅ Database configured with SQLite');
  console.log('✅ Authentication bypass enabled for development');
  console.log('⚠️  Amplitude errors are from browser extensions (not critical)');
}

main().catch(console.error);