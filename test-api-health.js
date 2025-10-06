// API Health and Connectivity Test Script
const BASE_URL = 'http://localhost:3002/api';

async function testAPIHealth() {
  console.log('🔍 Testing API Health and Connectivity...\n');
  
  const tests = [
    {
      name: 'Health Check',
      url: `${BASE_URL}/health`,
      method: 'GET'
    },
    {
      name: 'Contract Stats',
      url: `${BASE_URL}/contracts/stats`,
      method: 'GET'
    },
    {
      name: 'Contract List',
      url: `${BASE_URL}/contracts?page=1&pageSize=5`,
      method: 'GET'
    },
    {
      name: 'Contract Insights',
      url: `${BASE_URL}/contracts/insights`,
      method: 'GET'
    },
    {
      name: 'Contract Milestones',
      url: `${BASE_URL}/contracts/milestones`,
      method: 'GET'
    },
    {
      name: 'Auth Me (Development)',
      url: `${BASE_URL}/auth/me`,
      method: 'GET'
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      const startTime = Date.now();
      const response = await fetch(test.url, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const responseTime = Date.now() - startTime;
      const data = await response.text();
      
      if (response.ok) {
        console.log(`✅ ${test.name}`);
        console.log(`   Status: ${response.status} ${response.statusText}`);
        console.log(`   Response Time: ${responseTime}ms`);
        console.log(`   Data Length: ${data.length} bytes`);
        
        // Try to parse JSON if possible
        try {
          const jsonData = JSON.parse(data);
          if (test.name === 'Contract Stats' && jsonData.activeContracts) {
            console.log(`   Active Contracts: ${jsonData.activeContracts.count}`);
          } else if (test.name === 'Contract List' && jsonData.data) {
            console.log(`   Contracts Found: ${jsonData.data.length}`);
          }
        } catch (e) {
          // Not JSON, that's fine
        }
        
        passedTests++;
      } else {
        console.log(`❌ ${test.name}`);
        console.log(`   Status: ${response.status} ${response.statusText}`);
        console.log(`   Error: ${data}`);
      }
      
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   Error: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }

  // Summary
  console.log('📊 Test Summary:');
  console.log(`   Passed: ${passedTests}/${totalTests}`);
  console.log(`   Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! API is healthy and ready.');
  } else {
    console.log('⚠️  Some tests failed. Check API server status.');
  }
}

// Quick connectivity test
async function quickConnectivityTest() {
  console.log('⚡ Quick Connectivity Test...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ API Server is reachable');
      console.log(`   URL: ${BASE_URL}`);
      console.log(`   Status: ${response.status}`);
      return true;
    } else {
      console.log('❌ API Server returned error');
      console.log(`   Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot reach API Server');
    console.log(`   Error: ${error.message}`);
    console.log('   Possible issues:');
    console.log('   - API server is not running');
    console.log('   - Wrong port (check if running on 3002)');
    console.log('   - Network connectivity issue');
    return false;
  }
}

// Run tests based on command line argument
const testType = process.argv[2];

if (testType === 'quick') {
  quickConnectivityTest();
} else {
  testAPIHealth();
}