export type AlertType = 'info' | 'success' | 'warning' | 'error'

export type Alert = {
  id: string;
  message: string;
  type: AlertType;
  timeout?: number;
}

export type AddAlertFn = (
  message: string,
  type: AlertType,
  timeout?: number
) => Alert["id"]

export type RemoveAlertFn = (id: Alert["id"]) => void

export interface AlertsContext {
  alerts: Alert[];
  addAlert: AddAlertFn;
  removeAlert: RemoveAlertFn;
}
