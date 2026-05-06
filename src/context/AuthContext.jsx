import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { ADMIN_EMAIL } from '../config/firebase.config';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email === ADMIN_EMAIL) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        toast.error('Access denied. Unauthorized account.');
        return null;
      }
      toast.success('Welcome back, Hazem! 🚀');
      return result.user;
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed.');
      return null;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      if (email !== ADMIN_EMAIL) {
        toast.error('Access denied. Unauthorized email.');
        return null;
      }
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back, Hazem! 🚀');
      return result.user;
    } catch (err) {
      const msg = err.code === 'auth/wrong-password' ? 'Wrong password.' :
                  err.code === 'auth/user-not-found' ? 'User not found.' :
                  err.code === 'auth/too-many-requests' ? 'Too many attempts. Try again later.' :
                  'Sign-in failed. Check credentials.';
      toast.error(msg);
      return null;
    }
  };

  const logout = async () => {
    await signOut(auth);
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
