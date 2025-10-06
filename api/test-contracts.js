const axios = require('axios');

async function testContractAPI() {
  try {
    console.log('Testing contract creation...');
    
    const contractData = {
      buyerName: 'Test Buyer',
      contractTitle: 'Test Contract',
      contractType: 'service',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      contractValue: 10000,
      industry: 'Technology'
    };
    
    const response = await axios.post('http://localhost:3002/api/contracts', contractData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Contract created successfully:', response.data);
    
    // Test getting contracts
    const getResponse = await axios.get('http://localhost:3002/api/contracts');
    console.log('✅ Contracts retrieved:', getResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Full error:', error);
  }
}

testContractAPI();