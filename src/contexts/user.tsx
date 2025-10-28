'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from '../firebase.config'
import type { User } from "firebase/auth/web-extension";
import { doc, getDoc, FirestoreError } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useAlerts } from "./alerts";

const Context = createContext<{
  user: User | null;
  admin: boolean;
  loading: boolean;
  logout: () => void;
  clearUser: () => void;
  redirected: boolean;
  setRedirected: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  user: null,
  admin: false,
  loading: false,
  logout: () => { },
  clearUser: () => { },
  redirected: false,
  setRedirected: () => { }
});
const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(auth.currentUser);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redirected, setRedirected] = useState(false);
  const { addAlert: addAlert, clearAlerts: clearAlerts } = useAlerts();

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
        if (e instanceof FirestoreError && e.code === 'permission-denied' && !!user.email) {
          const authorizedUserSnap = await getDoc(doc(db, "authorized-users", user.email));
          if (authorizedUserSnap.exists()) {
            setUser(user);
            setAdmin(authorizedUserSnap.data().Role === 'admin');
            addAlert(`Welcome, ${authorizedUserSnap.data().FullName}!`, 'success', 3000);
            return;
          }
        }
        setAdmin(false);
        setUser(null);
        console.error(e)
        addAlert('Auth error: Invalid user', 'error');
      } finally {
        setLoading(false);
      }
    });
  }, [addAlert, clearAlerts]);

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
