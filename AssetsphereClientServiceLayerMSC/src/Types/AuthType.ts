export enum UserRoleType {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
}

export enum DepartmentType {
  Engineering = 'Engineering',
  SecurityOperations = 'SecurityOperations',
  FinanceAndProcurement = 'FinanceAndProcurement',
  ProductDesign = 'ProductDesign',
  ITInfrastructure = 'ITInfrastructure',
  HumanResources = 'HumanResources',
  LegalAndCompliance = 'LegalAndCompliance',
  Operations = 'Operations',
}

export interface UserProfileType {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRoleType | string;
  department?: DepartmentType | string | null;
  avatarUrl?: string | null;
  lastLoginAt?: string | null;
}

export interface AuthTokensType {
  accessToken: string;
  refreshToken: string;
  expiresAt?: string | null;
}

export interface AuthResponsePayloadType {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: UserProfileType;
}

export interface AuthStateSessionType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
  userRole: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresAt?: string | null;
  user?: UserProfileType | null;
}
