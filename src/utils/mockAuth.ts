// Mock login helper for development/testing
// This file demonstrates how the login flow works
// In production, replace this with actual API calls

export const mockLogin = () => {
  const mockToken = 'mock-jwt-token-' + Date.now();
  const mockUser = {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
  };
  
  return {
    token: mockToken,
    user: mockUser,
  };
};
