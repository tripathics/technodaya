'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from '../firebasse.config'
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import usePageAlerts from "@/hooks/pageAlerts";

const Context = createContext();
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(auth.currentUser);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redirected, setRedirected] = useState(false);
  const { add: addAlert, clear: clearAlerts } = usePageAlerts();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setLoading(true);

      if (user === null) {
        setAdmin(false);
        setLoading(false);
        return;
      }
      clearAlerts();
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setAdmin(docSnap.data().Role === 'admin');
          addAlert(`Welcome back, ${docSnap.data().FullName}!`, 'success', 3000);
        } else {
          setAdmin(false);
        }
      } catch (e) {
        setAdmin(false);
        setUser(null);
        addAlert('Auth error: Invalid user', 'error');
      } finally {
        setLoading(false);
      }
    });
  }, [])

  const logout = () => {
    signOut(auth);
    addAlert('Logged out', 'success', 3000);
  }

  const clearUser = () => {
    setUser(null);
    setAdmin(false);
    signOut(auth);
  }

  const exposed = { user, admin, loading, logout, clearUser, redirected, setRedirected }

  return (<Context.Provider value={exposed}>
    {children}
  </Context.Provider>);
}

export const useUser = () => useContext(Context);

export default UserProvider;