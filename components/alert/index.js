import DismissIcon from "../icons/remove-icon";
import ErrorIcon from "../icons/alerts/error-icon";
import SuccessIcon from "../icons/alerts/success-icon";
import WarningIcon from "../icons/alerts/warning-icon";
import InfoIcon from "../icons/alerts/info-icon";

import styles from "./alert.module.scss";
import cx from "classnames";
import { useEffect, useState } from "react";

const Icon = ({ severity }) => {
  if (severity === "success") return <SuccessIcon />;
  else if (severity === "warning") return <WarningIcon />;
  else if (severity === "error") return <ErrorIcon />;
  else return <InfoIcon />;
};

const Alert = ({ severity = "info", message = "", timeout = null, handleDismiss = null }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [alertText, setAlertText] = useState("");

  useEffect(() => {
    if (!!message.length) {
      setAlertText(message);
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        setAlertText("");
      }, 300);
    }
  }, [message]);

  useEffect(() => {
    if (timeout) {
      let t = setTimeout(() => {
        dismissAlert();
      }, timeout);

      return () => {
        clearTimeout(t);
        dismissAlert();
      }
    }
  }, [])

  const dismissAlert = () => {
    setIsVisible(false);
    setTimeout(() => {
      handleDismiss();
    }, 300);
  };

  return (
    <div className={cx(styles.alert, styles[severity], { [styles.active]: isVisible }, { [styles.static]: !timeout && !handleDismiss })} >
      <div className={styles.icon}>
        <Icon severity={severity} />
      </div>
      <div className={styles.message}>{alertText}</div>
      {handleDismiss && (
        <button
          type="button"
          className={styles.dismiss}
          onClick={dismissAlert}
        >
          <DismissIcon />
        </button>
      )}
    </div>
  );
};

export const AlertsWrapper = ({ children }) => (
  <div className={styles['alert-wrapper']}>
    {children}
  </div>
)

export default Alert;