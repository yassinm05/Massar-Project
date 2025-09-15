interface types {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  password: string;
}

export default async function createUser({firstName, lastName, email, password, role, phoneNumber}: types) {
  try {
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
      phoneNumber,
    };

    // Log the data being sent for debugging
    console.log('Sending user data:', userData);

    const response = await fetch('http://localhost:5236/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    // Get the response body for better error details
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Server error response:', result);
      
      // Handle specific error cases
      if (response.status === 400) {
        if (result.message) {
          throw new Error(`Validation error: ${result.message}`);
        } else if (result.errors) {
          const errorMessages = Object.values(result.errors).join(', ');
          throw new Error(`Validation errors: ${errorMessages}`);
        } else {
          throw new Error(`Bad request: ${JSON.stringify(result)}`);
        }
      }
      
      throw new Error(`HTTP error! status: ${response.status}, message: ${result.message || 'Unknown error'}`);
    }

    console.log('User created successfully:', result);
    return result;

  } catch (error) {
    console.error('Error creating user:', error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check if the server is running.');
    }
    
    throw error;
  }
}