'use client'
import Alert, { AlertWrapper } from "@/components/alert";
import { createContext, useState, useContext } from "react";

const AlertsContext = createContext();
const Provider = ({ children }) => {
  const [alerts, setAlerts] = useState([]); // [ { id, message, type, timeout }, ... ]

  const addAlert = (message, type) => {
    const id = Math.random().toString(36).slice(2, 9);
    setAlerts([{ id, message, type }, ...alerts]);
  };

  const removeAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertsContext.Provider>
  )
};

const Alerts = () => {
  const { alerts, removeAlert } = useContext(AlertsContext);

  return (
    <AlertWrapper>
      {alerts.map((alert) => (
        <Alert key={alert.id} severity={alert.type}
          message={alert.message} handleDismiss={() => removeAlert(alert.id)} />
      ))}
    </AlertWrapper>
  )
}

const useAlerts = () => useContext(AlertsContext);

export { Alerts, Provider, useAlerts };
export default Provider;