import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../Firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Always seed userDetails from the auth user so pages that depend on it
        // (e.g. Scan) still render even if the Firestore profile is missing.
        let data = {};
        try {
          const docSnap = await getDoc(doc(db, 'Users', user.uid));
          if (docSnap.exists()) data = docSnap.data();
        } catch (error) {
          console.error('Failed to load user profile:', error);
        }
        setUserDetails({
          ...data,
          uid: user.uid,
          email: data.email || user.email,
          name:
            data.name ||
            user.displayName ||
            user.email?.split('@')[0] ||
            'there',
          points: typeof data.points === 'number' ? data.points : 0,
        });
        setFavorites(Array.isArray(data.loveList) ? data.loveList : []);
      } else {
        setUserDetails(null);
        setFavorites([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isFavorite = (name) => favorites.includes(name);

  const toggleFavorite = async (name) => {
    if (!userDetails?.uid || !name) return;

    const next = favorites.includes(name)
      ? favorites.filter((n) => n !== name)
      : [...favorites, name];

    // optimistic update so the heart reacts instantly
    setFavorites(next);
    setUserDetails((prev) => (prev ? { ...prev, loveList: next } : prev));

    try {
      await setDoc(
        doc(db, 'Users', userDetails.uid),
        { loveList: next },
        { merge: true }
      );
    } catch (error) {
      console.error('Failed to update favorites:', error);
      // roll back on failure
      setFavorites(favorites);
      setUserDetails((prev) => (prev ? { ...prev, loveList: favorites } : prev));
    }
  };

  return (
    <UserContext.Provider
      value={{ userDetails, loading, favorites, isFavorite, toggleFavorite }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
