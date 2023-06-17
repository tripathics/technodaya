'use client'
import { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from '../firebasse.config'
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const Context = createContext();
const Provider = ({ children }) => {
  const [user, setUser] = useState(auth.currentUser);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setLoading(true);

      if (user === null) {
        setAdmin(false);
        setLoading(false);
        return;
      }
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setAdmin(docSnap.data().Role === 'admin');
        } else {
          setAdmin(false);
        }
      } catch (e) {
        setAdmin(false);
        console.error(e);
      } finally {
        setLoading(false);
      }
    });
  }, [])

  const logout = () => {
    signOut(auth);
  }

  const exposed = { user, admin, loading, logout }

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
}

export const useUser = () => useContext(Context);

export default Provider;