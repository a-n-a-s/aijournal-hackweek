import { auth, db, googleProvider } from "./firebase";
import { 
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user document exists, create if not
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || `User${user.uid.substring(0, 5)}`,
            entries: [],
            createdAt: new Date()
          });
        }
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      // The onAuthStateChanged listener will handle document creation
      return result.user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => signOut(auth);

  return children({ user, loading, signInWithGoogle, logout });
};