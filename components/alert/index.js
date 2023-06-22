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

const Alert = ({ severity = "info", message = "", handleDismiss = null }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!message.length) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 8000)

    return () => {
      clearTimeout(timeout);
    }
  }, [message])

  return (
    <div className={cx(styles.alert, styles[severity], { [styles.active]: isVisible })} >
      <div className={styles.icon}>
        <Icon severity={severity} />
      </div>
      <div className={styles.message}>{message}</div>
      {handleDismiss && (
        <button
          type="button"
          className={styles.dismiss}
          onClick={handleDismiss}
        >
          <DismissIcon />
        </button>
      )}
    </div>
  );
};

export default Alert;
