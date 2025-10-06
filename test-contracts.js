// Quick test of contract endpoints
async function testContractEndpoints() {
  const baseURL = 'http://localhost:3002/api';
  
  console.log('Testing contract API endpoints...\n');
  
  // Test stats endpoint
  try {
    const response = await fetch(`${baseURL}/contracts/stats`);
    const data = await response.json();
    console.log('✅ Stats endpoint:', response.status, data);
  } catch (error) {
    console.error('❌ Stats endpoint error:', error.message);
  }
  
  // Test contracts list endpoint
  try {
    const response = await fetch(`${baseURL}/contracts?page=1&pageSize=10&sortBy=riskScore&sortOrder=desc`);
    const data = await response.json();
    console.log('✅ Contracts endpoint:', response.status, `${data.data?.length || 0} contracts`);
  } catch (error) {
    console.error('❌ Contracts endpoint error:', error.message);
  }
  
  // Test insights endpoint
  try {
    const response = await fetch(`${baseURL}/contracts/insights`);
    const data = await response.json();
    console.log('✅ Insights endpoint:', response.status, data);
  } catch (error) {
    console.error('❌ Insights endpoint error:', error.message);
  }
  
  // Test milestones endpoint
  try {
    const response = await fetch(`${baseURL}/contracts/milestones`);
    const data = await response.json();
    console.log('✅ Milestones endpoint:', response.status, `${data?.length || 0} milestones`);
  } catch (error) {
    console.error('❌ Milestones endpoint error:', error.message);
  }
}

testContractEndpoints();