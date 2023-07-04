'use client'
import Alert, { AlertsWrapper } from "@/components/alert";
import { createContext, useState, useContext } from "react";

const AlertsContext = createContext();
const Provider = ({ children }) => {
  const [alerts, setAlerts] = useState([]); // [ { id, message, type, timeout }, ... ]

  const addAlert = (message, type, timeout = null) => {
    const id = Math.random().toString(36).slice(2, 9);
    timeout = timeout || (type === 'error' ? 10000 : 5000);
    setAlerts([{ id, message, type, timeout }, ...alerts]);
    return id;
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
    <AlertsWrapper>
      {alerts.map((alert) => (
        <Alert key={alert.id} severity={alert.type}
          timeout={alert.timeout}
          message={alert.message}
          handleDismiss={() => removeAlert(alert.id)} />
      ))}
    </AlertsWrapper>
  )
}

const useAlerts = () => useContext(AlertsContext);

export { Alerts, Provider, useAlerts };
export default Provider;