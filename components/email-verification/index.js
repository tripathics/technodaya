'use client'
import { useState } from "react";
import Alert from "../alert";
import { sendEmailVerification } from "firebase/auth";
import SpinnerIcon from "../icons/spinner-icon";
import styles from './EmailVerification.module.scss';
import { useAlerts } from "@/contexts/alerts";

const EmailVerification = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [alertIds, setAlertIds] = useState([]); // [ id, ... ]
  const { addAlert, removeAlert } = useAlerts();

  const verifyEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    alertIds.forEach(id => removeAlert(id));
    setAlertIds([]);
    sendEmailVerification(user).then(() => {
      setLoaded(true);
      let id = addAlert(`Verification link sent ${user.email}`, 'success');
      setAlertIds(prevIds => [...prevIds, id]);
    }).catch(err => {
      console.error(err);
      let id = addAlert(err.message, 'error');
      setAlertIds(prevIds => [...prevIds, id]);
    })
  }

  return (
    <div className={styles.verify}>
      <Alert message="Verify your email to view your form submissions, reset passwords and more" />
      <h4>Instructions</h4>
      <ul>
        <li>An email containing a verification link will be sent to {user ? <strong>{user.email}</strong> : 'your email'} once you click &quot;Verify now&quot;.</li>
        <li>Visit the verification link and your email will be verified. Login again to see the changes.</li>
      </ul>

      {(!alertIds.length && !loaded) && (
        !loading
          ? <button className="btn submit" onClick={verifyEmail}>Verify now</button>
          : <button className="btn submit" disabled>
            <SpinnerIcon />
          </button>
      )}
    </div>
  )
}

export default EmailVerification;