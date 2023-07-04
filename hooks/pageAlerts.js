import { useAlerts } from "@/contexts/alerts";
import { useEffect, useRef, useState } from "react";

const usePageAlerts = () => {
  const { addAlert, removeAlert } = useAlerts();
  const [alertIds, setAlertIds] = useState([]); // [{ message: '', severity: '' }
  const alertIdsRef = useRef([]);

  const add = (message, severity, timeout = null) => {
    let id = addAlert(message, severity, timeout);
    alertIdsRef.current = [...alertIdsRef.current, id];
    setAlertIds([...alertIdsRef.current]);
  }

  const clear = () => {
    alertIdsRef.current.forEach(id => removeAlert(id));
    alertIdsRef.current = [];
    setAlertIds([]);
  }

  useEffect(() => {
    return () => {
      alertIdsRef.current.forEach(id => removeAlert(id));
    }
  }, []);

  return { add, clear, alertIds };
}

export default usePageAlerts;