// const http = require('http');

// const data = JSON.stringify({
//   feature: 'flexbox'
// });

// const options = {
//   hostname: 'localhost',
//   port: 5000,
//   path: '/check-feature',
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Content-Length': data.length
//   }
// };

// const req = http.request(options, (res) => {
//   console.log(`Status: ${res.statusCode}`);
//   console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
//   let responseData = '';
//   res.on('data', (chunk) => {
//     responseData += chunk;
//   });
  
//   res.on('end', () => {
//     console.log('Response:', responseData);
//   });
// });

// req.on('error', (error) => {
//   console.error('Error:', error);
// });

// req.write(data);
// req.end();