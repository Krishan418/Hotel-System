/**
 * useApi.js — Custom hook for making API calls with JWT
 *
 * WHAT IT DOES:
 *   Every protected API route requires an Authorization header with our JWT token.
 *   Instead of writing the same header code on every fetch() call,
 *   this hook creates a reusable function that automatically adds the token.
 *
 * HOW TO USE IN A COMPONENT:
 *   const { get, post, put, del, loading, error } = useApi();
 *
 *   // Fetch rooms (GET request)
 *   const data = await get('/api/rooms');
 *
 *   // Create a booking (POST request with body)
 *   const result = await post('/api/bookings', { roomId, checkIn, checkOut });
 *
 * WHAT IT RETURNS:
 *   - get(url)           → sends GET request with auth header
 *   - post(url, body)    → sends POST request with auth header + JSON body
 *   - put(url, body)     → sends PUT request with auth header + JSON body
 *   - del(url)           → sends DELETE request with auth header
 *   - loading            → true while a request is in progress
 *   - error              → error message string (or null if no error)
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function useApi() {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Build the Authorization header.
   * Every request to a protected backend route needs this.
   */
  function buildHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Core fetch wrapper.
   * All get/post/put/del methods call this.
   */
  async function request(url, options = {}) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        headers: buildHeaders(),
      });

      const data = await response.json();

      // If the token expired or is invalid, force logout
      if (response.status === 401) {
        logout();
        throw new Error('Session expired. Please login again.');
      }

      // If the server says "forbidden" (wrong role)
      if (response.status === 403) {
        throw new Error('Access denied — you do not have permission to do this.');
      }

      // For other error status codes
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      return data;

    } catch (err) {
      setError(err.message);
      throw err; // Re-throw so the calling component can catch it too
    } finally {
      setLoading(false);
    }
  }

  // Shorthand methods — easier to use in components
  const get  = (url)       => request(url, { method: 'GET' });
  const post = (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) });
  const put  = (url, body) => request(url, { method: 'PUT',  body: JSON.stringify(body) });
  const del  = (url)       => request(url, { method: 'DELETE' });

  return { get, post, put, del, loading, error };
}

export default useApi;
