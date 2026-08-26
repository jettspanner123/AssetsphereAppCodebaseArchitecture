export default class TanstackQueryKeysCON {
  public static readonly ASSETS = ['assets'] as const;
  public static readonly ASSET_DETAIL = (id: string) => ['assets', id] as const;
  public static readonly ASSET_QR = (qrId: string) => ['assets', 'qr', qrId] as const;
  public static readonly EMPLOYEES = ['employees'] as const;
  public static readonly EMPLOYEE_DETAIL = (id: string) => ['employees', id] as const;
  public static readonly CONFIGURATION_CONSTANTS = ['configuration'] as const;
  public static readonly CONFIGURATION_CONSTANT = (key: string) => ['configuration', key] as const;
  public static readonly WORK_LOCATIONS = ['configuration', 'WORK_LOCATIONS'] as const;
  public static readonly EMPLOYEE_DESIGNATIONS = ['configuration', 'EMPLOYEE_DESIGNATIONS'] as const;
  public static readonly AUTH_SESSION = ['auth', 'session'] as const;
  public static readonly PENDING_USERS = ['auth', 'pending-users'] as const;
  public static readonly NOTIFICATIONS = ['notifications'] as const;
  public static readonly DEVICE_SERVICE_REQUESTS = ['device-service-requests'] as const;
  public static readonly MY_DEVICE_SERVICE_REQUESTS = ['device-service-requests', 'my-requests'] as const;
}
