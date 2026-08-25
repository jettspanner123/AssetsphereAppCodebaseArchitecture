export type PriorityLevelType = 'LOW' | 'MID' | 'HIGH';

export type NotificationEventType =
  | 'NEW_USER_ACCOUNT_CREATION_REQUEST'
  | 'USER_ACCOUNT_APPROVED'
  | 'USER_ACCOUNT_REJECTED'
  | 'SYSTEM_BROADCAST'
  | 'ASSET_ASSIGNED'
  | 'WARRANTY_EXPIRING'
  | 'COMPLIANCE_ALERT'
  | 'MAINTENANCE_DUE';

export interface NotificationActionType {
  kind: string;
  direction: string;
}

export interface NotificationItemType {
  id: string;
  heading: string;
  description: string;
  icon: string;
  priorityLevel: PriorityLevelType;
  type: NotificationEventType | string;
  createdAt: string;
  isRead: boolean;
  viewByUsers: string[];
  packagedData?: Record<string, any> | null;
  action: NotificationActionType;
  targetRoles: string[];
}

export interface CreateNotificationRequest {
  heading: string;
  description: string;
  icon?: string;
  priorityLevel?: PriorityLevelType;
  type?: NotificationEventType | string;
  packagedData?: Record<string, any>;
  action?: NotificationActionType;
  targetRoles?: string[];
}
