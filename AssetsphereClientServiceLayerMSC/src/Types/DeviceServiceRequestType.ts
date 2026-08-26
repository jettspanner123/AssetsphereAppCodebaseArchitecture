export type ServiceRequestUrgencyType = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ServiceRequestStatusType =
  | 'PENDING'
  | 'IN_REVIEW'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED';

export interface DeviceServiceRequestItemType {
  id: string;
  requestNumber: string;

  requesterUserId: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;

  targetUserId: string;
  targetUserName: string;
  targetUserEmail: string;

  assetId?: string | null;
  assetTag: string;
  assetName: string;

  serviceCategory: string;
  componentSubtype: string;
  usabilityState: string;
  serviceChannel: string;
  urgency: ServiceRequestUrgencyType | string;
  workLocation: string;

  descriptionRichText: string;
  status: ServiceRequestStatusType | string;
  resolutionNotes?: string | null;

  createdAt: string;
  updatedAt?: string | null;
  createdBy: string;
  updatedBy?: string | null;
}

export interface CreateDeviceServiceRequestInput {
  targetUserId?: string;
  targetUserName?: string;
  targetUserEmail?: string;

  assetId?: string;
  assetTag: string;
  assetName: string;

  serviceCategory: string;
  componentSubtype: string;
  usabilityState: string;
  serviceChannel: string;
  urgency: string;
  workLocation: string;

  descriptionRichText: string;
}

export interface UpdateDeviceServiceRequestStatusInput {
  status: ServiceRequestStatusType | string;
  resolutionNotes?: string;
}
