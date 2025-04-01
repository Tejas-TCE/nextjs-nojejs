import fetch from 'node-fetch';

const registerUser = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Welcome Email',
        email: 'welcome-test@example.com',
        password: 'password123'
      }),
    });

    const data = await response.json();
    console.log('Registration response:', data);
  } catch (error) {
    console.error('Error registering user:', error);
  }
};

registerUser(); 