// Test function to verify the /api/v1/auth/me endpoint
export async function testAuthMe() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.log('No access token found in localStorage');
    return;
  }

  console.log('Testing /api/v1/auth/me with token:', token.substring(0, 20) + '...');

  try {
    const response = await fetch('http://localhost:8080/api/v1/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      console.log('✅ /api/v1/auth/me endpoint is working');
    } else {
      console.log('❌ /api/v1/auth/me endpoint returned an error');
    }
  } catch (error) {
    console.error('❌ Error testing /api/v1/auth/me:', error);
  }
}

// Make it available on window for easy testing
if (typeof window !== 'undefined') {
  (window as any).testAuthMe = testAuthMe;
}