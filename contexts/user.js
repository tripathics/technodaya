'use client'
import { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from '../firebasse.config'
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import usePageAlerts from "@/hooks/pageAlerts";

const Context = createContext();
const Provider = ({ children }) => {
  const [user, setUser] = useState(auth.currentUser);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redirected, setRedirected] = useState(false);
  const { add: addAlert, clear: clearAlerts } = usePageAlerts();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      clearAlerts();

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
          addAlert(`Welcome back, ${docSnap.data().FullName}!`, 'success');
        } else {
          setAdmin(false);
        }
      } catch (e) {
        setAdmin(false);
        addAlert('Invalid user', 'error');
      } finally {
        setLoading(false);
      }
    });
  }, [])

  const logout = () => {
    addAlert('Logging out...', 'info');
    signOut(auth);
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

export default Provider;