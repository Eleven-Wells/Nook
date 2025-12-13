// Check if user is logged in
export const isLoggedIn = () => {
    return localStorage.getItem('currentUser') !== null;
  };
  
  // Get current user
  export const getCurrentUser = () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  };
  
  // Logout user
  export const logout = () => {
    localStorage.removeItem('currentUser');
  };
  
  // Check if user is a blogger
  export const isBlogger = () => {
    const user = getCurrentUser();
    return user && user.userType === 'blogger';
  };
  
  // Get all users (for admin purposes)
  export const getAllUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };