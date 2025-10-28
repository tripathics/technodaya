import { useAlerts } from "@/contexts/alerts";
import { AddAlertFn } from "@/types/alert";
import { useEffect, useRef, useState } from "react";

/**
 * @deprecated Use `useAlerts` directly instead
 */
const usePageAlerts = () => {
  const { addAlert, removeAlert } = useAlerts();
  const [alertIds, setAlertIds] = useState<string[]>([]); // [{ message: '', severity: '' }
  const alertIdsRef = useRef<string[]>([]);

  const add: AddAlertFn = (message, severity, timeout) => {
    const id = addAlert(message, severity, timeout);
    alertIdsRef.current = [...alertIdsRef.current, id];
    setAlertIds([...alertIdsRef.current]);
    return id;
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
