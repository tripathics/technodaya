import DismissIcon from "../icons/remove-icon";
import ErrorIcon from "../icons/alerts/error-icon";
import SuccessIcon from "../icons/alerts/success-icon";
import WarningIcon from "../icons/alerts/warning-icon";
import InfoIcon from "../icons/alerts/info-icon";

import styles from "./alert.module.scss";
import cx from "classnames";
import { use, useEffect, useState } from "react";

const Icon = ({ severity }) => {
  if (severity === "success") return <SuccessIcon />;
  else if (severity === "warning") return <WarningIcon />;
  else if (severity === "error") return <ErrorIcon />;
  else return <InfoIcon />;
};

const Alert = ({ severity = "info", message = "", handleDismiss = null }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [alertText, setAlertText] = useState("");

  useEffect(() => {
    let timeout, timeout2;
    if (!!message.length) {
      setAlertText(message);
      setIsVisible(true);
    } else {
      setIsVisible(false);
      timeout = setTimeout(() => {
        setAlertText("");
      }, 1000);
    }

    if (!handleDismiss) {
      timeout2 = setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    }

    return () => {
      clearTimeout(timeout);
      clearTimeout(timeout2);
    }
  }, [message, handleDismiss]);

  const dismissAlert = () => {
    setIsVisible(false);
    setTimeout(() => {
      handleDismiss();
    }, 300);
  };

  return (
    <div className={cx(styles.alert, styles[severity], { [styles.active]: isVisible })} >
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

export const AlertWrapper = ({ children }) => (
  <div className={styles['alert-wrapper']}>
    {children}
  </div>
)

export default Alert;