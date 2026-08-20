export default class ApplicationRouteCON {
  public static readonly ROOT: string = '/';
  public static readonly LOGIN: string = '/login';
  public static readonly SIGNUP: string = '/signup';
  public static readonly FORGOT_PASSWORD: string = '/forgot-password';

  // Dashboard Nested Routes
  public static readonly DASHBOARD_ROOT: string = '/dashboard';
  public static readonly DASHBOARD_OVERVIEW: string = '/dashboard';
  public static readonly DASHBOARD_INVENTORY: string = '/dashboard/asset-inventory';
  public static readonly DASHBOARD_EMPLOYEES: string = '/dashboard/employees';
  public static readonly DASHBOARD_LICENSES: string = '/dashboard/software-licenses';
  public static readonly DASHBOARD_CLOUD: string = '/dashboard/cloud-resources';
  public static readonly DASHBOARD_PROCUREMENT: string = '/dashboard/procurement';
  public static readonly DASHBOARD_SERVICEDESK: string = '/dashboard/service-desk';
  public static readonly DASHBOARD_VENDORS: string = '/dashboard/vendors';
  public static readonly DASHBOARD_COMPLIANCE: string = '/dashboard/compliance';
  public static readonly DASHBOARD_VERIFICATION: string = '/dashboard/verification-campaign';
  public static readonly DASHBOARD_AI_COPILOT: string = '/dashboard/ai-copilot';
  public static readonly DASHBOARD_ANALYTICS: string = '/dashboard/analytics';
  public static readonly DASHBOARD_SETTINGS: string = '/dashboard/settings';

  // Query Parameter Keys
  public static readonly PARAM_SEARCH: string = 'search';
  public static readonly PARAM_SELECTED_ASSET_ID: string = 'selectedAssetId';
  public static readonly PARAM_ASSET_TAB: string = 'assetTab';
  public static readonly PARAM_NEW_ASSET: string = 'newAsset';
  public static readonly PARAM_SCANNER: string = 'scanner';
  public static readonly PARAM_QR_ASSET_ID: string = 'qrAssetId';
  public static readonly PARAM_STATUS: string = 'status';
  public static readonly PARAM_VIEW: string = 'view';
  public static readonly PARAM_COLS: string = 'cols';
  public static readonly PARAM_SINGLE_LINE: string = 'singleLine';
}
