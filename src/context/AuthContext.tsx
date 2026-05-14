import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Club } from '../types';

interface AuthContextType {
  user: User | null;
  club: Club | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, club: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user && user.email) {
        // Fetch club associated with this email
        const q = query(collection(db, 'clubs'), where('email', '==', user.email));
        const unsubClub = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const clubDoc = snapshot.docs[0];
            setClub({ id: clubDoc.id, ...clubDoc.data() } as Club);
          } else {
            setClub(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("AuthContext Club List Error:", error);
          setLoading(false);
        });
        return () => unsubClub();
      } else {
        setClub(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, club, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
