// Test script for the analyze-code endpoint
const testCode = `
const fetchData = async () => {
  const response = await fetch('/api/data')
  return await response.json()
}

// CSS with :has selector
.parent:has(.child) {
  background: red;
}

// Container queries
@container (min-width: 300px) {
  .element { font-size: 2rem; }
}

// Using document.write (unsafe)
document.write('<p>Hello</p>');
`;

fetch('http://localhost:5000/analyze-code', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    code: testCode,
    language: 'javascript'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Analysis Result:');
  console.log(JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('Error:', error);
});