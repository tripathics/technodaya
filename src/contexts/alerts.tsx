'use client'
import Alert, { AlertsWrapper } from "@/components/alert";
import { AlertsContext as IAlertsContext, Alert as AlertT, AddAlertFn, RemoveAlertFn } from "@/types/alert";
import { createContext, useState, useContext, useRef, useEffect, useCallback } from "react";

const AlertsContext = createContext<IAlertsContext>({
  alerts: [],
  addAlert: () => { throw new Error('Can\'t use alerts without context') },
  removeAlert: () => { throw new Error('Can\'t use alerts without context') },
});
const AlertsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertT[]>([]);
  const alertsRef = useRef<AlertT[]>([]);

  const addAlert: AddAlertFn = useCallback((message, type, timeout) => {
    const id = Math.random().toString(36).slice(2, 9) + new Date().getTime().toString(36);
    if (!timeout) timeout = type === 'error' ? 10000 : 5000;
    alertsRef.current = [{ id, message, type, timeout }, ...alertsRef.current];
    setAlerts(alertsRef.current);
    return id;
  }, []);

  const removeAlert: RemoveAlertFn = useCallback((id) => {
    alertsRef.current = alertsRef.current.filter((alert) => alert.id !== id);
    setAlerts([...alertsRef.current]);
  }, []);

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertsContext.Provider>
  )
};

const Alerts = () => {
  const { alerts, removeAlert } = useContext(AlertsContext);

  return (
    <AlertsWrapper>
      {alerts.map((alert) => (
        <Alert key={alert.id} severity={alert.type}
          timeout={alert.timeout}
          message={alert.message}
          handleDismiss={() => { removeAlert(alert.id) }} />
      ))}
    </AlertsWrapper>
  )
}

const useAlerts = () => {
  const { addAlert: add, removeAlert: remove } = useContext(AlertsContext)
  const alertIds = useRef<AlertT["id"][]>([])

  const clearAlerts = useCallback(() => {
    alertIds.current.forEach(id => remove(id))
    alertIds.current = []
  }, [remove])

  const addAlert: AddAlertFn = useCallback((message, type, timeout) => {
    const id = add(message, type, timeout)
    alertIds.current = [id, ...alertIds.current]
    return id
  }, [add])

  const removeAlert: RemoveAlertFn = useCallback((id) => {
    remove(id)
    alertIds.current = alertIds.current.filter(alertId => alertId !== id)
  }, [remove])

  useEffect(() => {
    return () => clearAlerts()
  }, [clearAlerts])

  return { alertIds, addAlert, removeAlert, clearAlerts }
}

export { Alerts, AlertsProvider as Provider, useAlerts };
export default AlertsProvider;
