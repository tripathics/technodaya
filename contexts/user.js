'use client'
import { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from '../firebasse.config'
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useAlerts } from "./alerts";

const Context = createContext();
const Provider = ({ children }) => {
  const [user, setUser] = useState(auth.currentUser);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redirected, setRedirected] = useState(false);
  const [alertIds, setAlertIds] = useState([]);   // [{message, severity}]
  const { addAlert, removeAlert } = useAlerts();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      alertIds.forEach(id => removeAlert(id));
      setAlertIds([]);

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
          let id = addAlert(`Welcome back, ${docSnap.data().FullName}!`, 'success');
          setAlertIds(prevIds => [...prevIds, id]);
        } else {
          setAdmin(false);
        }
      } catch (e) {
        setAdmin(false);
        let id = addAlert('Invalid user', 'error');
        setAlertIds(prevIds => [...prevIds, id]);
      } finally {
        setLoading(false);
      }
    });
  }, [])

  const logout = () => {
    signOut(auth);
  }

  const exposed = { user, admin, loading, logout, redirected, setRedirected }

  return (<Context.Provider value={exposed}>
    {children}
  </Context.Provider>);
}

export const useUser = () => useContext(Context);

export default Provider;