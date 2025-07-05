// Importing React and hooks
import React, { createContext, useContext, useEffect, useState } from 'react'; // createContext & useContext for context, useEffect & useState for state/side effects

// Firebase helper to listen for authentication state changes
import { onAuthStateChanged } from 'firebase/auth';

// Firebase authentication instance (exported from your config file)
import { auth } from '../firebase-config';

// Creating a Context object to share auth data app-wide
const AuthContext = createContext();

// Convenience hook so components can do: const { user } = useAuth();
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app (or a subtree) and exposes `user`
export const AuthProvider = ({ children }) => {
  // Local state to hold the current Firebase user (null when logged-out)
  const [user, setUser] = useState(null);

  // useEffect runs on mount; sets up Firebase listener & cleans up on unmount
  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function → so we just return it
    // Firebase will call `setUser` whenever the auth state changes (login/logout)
    return onAuthStateChanged(auth, setUser);
  }, []); // Empty dependency array → run only once when component mounts

  return (
    // Pass the `user` object down to any descendant that calls useAuth()
    <AuthContext.Provider value={{ user }}>
      {children} {/* Render any nested components */}
    </AuthContext.Provider>
  );
};
