/**
 * AuthContext.jsx
 *
 * This file provides authentication state to the entire app.
 * It uses React Context so any component can access:
 *   - `user`    → the logged-in user object (or null)
 *   - `token`   → the JWT token string
 *   - `login()` → save user after login
 *   - `logout()`→ clear user on logout
 */

import { createContext, useContext, useState } from 'react';

// 1. Create the context object
const AuthContext = createContext(null);

// 2. Provider component — wraps the whole app in App.jsx
export function AuthProvider({ children }) {
  // Load user from localStorage so login persists on page refresh
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('hotelUser');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('hotelToken') || null;
  });

  // Called after a successful login API response
  function login(userData, jwtToken) {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('hotelUser', JSON.stringify(userData));
    localStorage.setItem('hotelToken', jwtToken);
  }

  // Called when the user clicks "Logout"
  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hotelUser');
    localStorage.removeItem('hotelToken');
  }

  // Everything inside `value` is available to any child via useAuth()
  const value = { user, token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Custom hook — easy way to use auth in any component
export function useAuth() {
  return useContext(AuthContext);
}
