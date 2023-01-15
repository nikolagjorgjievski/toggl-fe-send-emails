import { ReactNode } from 'react';

export interface NotificationType {
  message: string | ReactNode | undefined,
  status: 'success' | 'error' | undefined,
}

export const defaultNotification: NotificationType = {
  message: undefined,
  status: undefined,
}
