import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from './firebase'; // Firebase configuration

const FirebaseAuthContext = createContext();

export function useAuth() {
  return useContext(FirebaseAuthContext);
}

export function FirebaseAuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const signup = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const logout = () => {
    return auth.signOut();
  };

  return (
    <FirebaseAuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}
