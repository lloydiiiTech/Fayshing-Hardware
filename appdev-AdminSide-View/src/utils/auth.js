// src/utils/auth.js

export const login = (username, password) => {
    // Example login function
    if (username === 'admin' && password === 'admin') {
      return true; // Simulate successful login
    }
    return false; // Simulate failed login
  };
  
  export const logout = () => {
    // Handle logout logic
  };
  