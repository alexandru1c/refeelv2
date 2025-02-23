import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from './firebase'; // Make sure to import auth from the updated firebase.js
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { supabase } from './supabase'; // Assuming supabase client is also correctly initialized

const FirebaseAuthContext = createContext();

export function useAuth() {
  return useContext(FirebaseAuthContext);
}

export function FirebaseAuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser(firebaseUser);

        // Check if the user exists in Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', firebaseUser.email)
          .single();

        if (error || !data) {
        }
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  return (
    <FirebaseAuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}
