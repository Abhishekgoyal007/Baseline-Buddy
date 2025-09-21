// // Test script for the backend
// const axios = require('axios');

// async function testBackend() {
//   try {
//     console.log('Testing backend server...');
    
//     // Test basic connectivity
//     const healthResponse = await axios.get('http://localhost:5000');
//     console.log('Health check:', healthResponse.data);
    
//     // Test feature check
//     const featureResponse = await axios.post('http://localhost:5000/check-feature', {
//       feature: 'flexbox'
//     });
//     console.log('Feature check response:', featureResponse.data);
    
//   } catch (error) {
//     console.error('Error testing backend:', error.response?.data || error.message);
//   }
// }

// testBackend();