/**
 * AuthContext.jsx (Enhanced)
 *
 * What changed from v1:
 *   - Added `verifyToken()` which calls GET /api/auth/me on app startup
 *   - This means if you already have a JWT in localStorage, we validate it
 *     against the server to ensure the user still exists and is still active.
 *   - If the token is invalid/expired, the user gets logged out automatically.
 *   - Added `authLoading` state so we don't flash the login page before
 *     the verification finishes.
 *
 * HOW IT WORKS:
 *   App starts → AuthContext mounts → if token in storage → call GET /api/auth/me
 *   ├── Server says OK → set user, set authLoading=false, show dashboard
 *   └── Server says 401 → clear storage, logout, redirect to login
 */

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]             = useState(null);
  const [token, setToken]           = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // true until token is verified

  /**
   * On first render, check if there's a saved token in localStorage.
   * If yes, verify it by calling /api/auth/me.
   */
  useEffect(() => {
    const savedToken = localStorage.getItem('hotelToken');
    const savedUser  = localStorage.getItem('hotelUser');

    if (savedToken && savedUser) {
      // Optimistically set the user from storage first (so UI loads faster)
      setToken(savedToken);
      setUser(JSON.parse(savedUser));

      // Then verify with the server
      verifyToken(savedToken);
    } else {
      // No saved token → not logged in
      setAuthLoading(false);
    }
  }, []); // [] means "run once when the component first mounts"

  /**
   * Verify the stored JWT by calling the "get me" endpoint.
   * If it fails, log the user out.
   */
  async function verifyToken(savedToken) {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${savedToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update user with fresh data from server
        setUser(data.user);
        localStorage.setItem('hotelUser', JSON.stringify(data.user));
      } else {
        // Token is invalid or expired → logout
        _clearStorage();
      }
    } catch (err) {
      // Network error — keep the user logged in for now
      // so they can still use the app if backend is temporarily down
      console.warn('Token verification skipped (network error).');
    } finally {
      setAuthLoading(false);
    }
  }

  /** Save user and token on successful login */
  function login(userData, jwtToken) {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('hotelUser', JSON.stringify(userData));
    localStorage.setItem('hotelToken', jwtToken);
  }

  /** Clear everything on logout */
  function logout() {
    _clearStorage();
  }

  function _clearStorage() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hotelUser');
    localStorage.removeItem('hotelToken');
  }

  const value = { user, token, authLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
