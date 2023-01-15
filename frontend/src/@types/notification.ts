
export interface NotificationType {
  message: string | undefined,
  status: 'success' | 'error' | undefined,
}

export const defaultNotification: NotificationType = {
  message: undefined,
  status: undefined,
}
