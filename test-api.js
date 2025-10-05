// Simple test script for the waitlist API endpoint
// Run with: node test-api.js

const testWaitlistAPI = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('Testing Waitlist API...\n');
  
  // Test 1: Valid email submission
  console.log('Test 1: Valid email submission');
  try {
    const response = await fetch(`${baseUrl}/api/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        source: 'hero'
      })
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    console.log('✅ Test 1 completed\n');
  } catch (error) {
    console.log('❌ Test 1 failed:', error.message);
  }
  
  // Test 2: Invalid email format
  console.log('Test 2: Invalid email format');
  try {
    const response = await fetch(`${baseUrl}/api/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid-email',
        source: 'footer_cta'
      })
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    console.log('✅ Test 2 completed\n');
  } catch (error) {
    console.log('❌ Test 2 failed:', error.message);
  }
  
  // Test 3: Missing email
  console.log('Test 3: Missing email');
  try {
    const response = await fetch(`${baseUrl}/api/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'hero'
      })
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    console.log('✅ Test 3 completed\n');
  } catch (error) {
    console.log('❌ Test 3 failed:', error.message);
  }
  
  // Test 4: Unsupported method (GET)
  console.log('Test 4: Unsupported method (GET)');
  try {
    const response = await fetch(`${baseUrl}/api/waitlist`, {
      method: 'GET'
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    console.log('✅ Test 4 completed\n');
  } catch (error) {
    console.log('❌ Test 4 failed:', error.message);
  }
  
  // Test 5: Rate limiting (multiple requests)
  console.log('Test 5: Rate limiting (6 rapid requests)');
  try {
    const promises = [];
    for (let i = 0; i < 6; i++) {
      promises.push(
        fetch(`${baseUrl}/api/waitlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: `test${i}@example.com`,
            source: 'hero'
          })
        })
      );
    }
    
    const responses = await Promise.all(promises);
    const results = await Promise.all(responses.map(r => r.json()));
    
    responses.forEach((response, index) => {
      console.log(`Request ${index + 1}: Status ${response.status}`);
      if (response.status === 429) {
        console.log('  ✅ Rate limiting working');
      }
    });
    console.log('✅ Test 5 completed\n');
  } catch (error) {
    console.log('❌ Test 5 failed:', error.message);
  }
  
  console.log('All tests completed!');
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testWaitlistAPI().catch(console.error);
}

export { testWaitlistAPI };