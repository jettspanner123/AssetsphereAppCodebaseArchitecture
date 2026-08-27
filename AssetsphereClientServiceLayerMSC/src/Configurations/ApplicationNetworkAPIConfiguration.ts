export interface NetworkAPIEndpoints {
  healthCheck: {
    status: string;
  };
  authentication: {
    login: string;
    register: string;
    me: string;
    refreshToken: string;
  };
  assetInventory: {
    base: string;
    getAll: string;
    getById: (id: string) => string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
  };
  employees: {
    base: string;
    getAll: string;
    getById: (id: string) => string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    assignedAssets: (id: string) => string;
  };
  configurationConstant: {
    base: string;
    getAll: string;
    getByKey: (key: string) => string;
    addDesignation: string;
    addDepartment: string;
    addWorkLocation: string;
    deleteWorkLocation: string;
  };
  notifications: {
    base: string;
    getAll: string;
    markAsRead: (id: string) => string;
    markAllAsRead: string;
    create: string;
  };
  deviceServiceRequests: {
    base: string;
    getAll: string;
    getMyRequests: string;
    getById: (id: string) => string;
    create: string;
    update: (id: string) => string;
    updateStatus: (id: string) => string;
  };
}

export interface ApplicationNetworkAPIConfigurationDetails {
  baseUrl: string;
  timeoutMs: number;
  headers: Record<string, string>;
  endpoints: NetworkAPIEndpoints;
}

export default class ApplicationNetworkAPIConfiguration {
  public static current: ApplicationNetworkAPIConfiguration = new ApplicationNetworkAPIConfiguration();

  private readonly defaultTimeoutMs: number = 10000;

  public getBaseUrl(): string {
    const envUrl =
      typeof import.meta !== 'undefined' && import.meta.env
        ? (import.meta.env.VITE_BACKEND_API_BASE_URL as string | undefined)
        : undefined;

    const processEnvUrl =
      typeof process !== 'undefined' && process.env
        ? (process.env.VITE_BACKEND_API_BASE_URL as string | undefined)
        : undefined;

    const configuredUrl = envUrl || processEnvUrl;
    if (configuredUrl) {
      return configuredUrl.replace(/\/+$/, '');
    }

    // When built for production (such as on Vercel), default to live Render Cloud API
    if (typeof import.meta !== 'undefined' && import.meta.env?.PROD) {
      return 'https://assetsphereappcodebasearchitecture.onrender.com';
    }

    return 'http://localhost:5125';
  }

  public getConfiguration(): ApplicationNetworkAPIConfigurationDetails {
    const activeBaseUrl = this.getBaseUrl();

    return {
      baseUrl: activeBaseUrl,
      timeoutMs: this.defaultTimeoutMs,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      endpoints: {
        healthCheck: {
          status: `${activeBaseUrl}/Api/V1/HealthCheck`,
        },
        authentication: {
          login: `${activeBaseUrl}/Api/V1/Authentication/Login`,
          register: `${activeBaseUrl}/Api/V1/Authentication/Register`,
          me: `${activeBaseUrl}/Api/V1/Authentication/Me`,
          refreshToken: `${activeBaseUrl}/Api/V1/Authentication/RefreshToken`,
        },
        assetInventory: {
          base: `${activeBaseUrl}/Api/V1/AssetInventory`,
          getAll: `${activeBaseUrl}/Api/V1/AssetInventory`,
          getById: (id: string) => `${activeBaseUrl}/Api/V1/AssetInventory/${id}`,
          create: `${activeBaseUrl}/Api/V1/AssetInventory`,
          update: (id: string) => `${activeBaseUrl}/Api/V1/AssetInventory/${id}`,
          delete: (id: string) => `${activeBaseUrl}/Api/V1/AssetInventory/${id}`,
        },
        employees: {
          base: `${activeBaseUrl}/Api/V1/Employees`,
          getAll: `${activeBaseUrl}/Api/V1/Employees`,
          getById: (id: string) => `${activeBaseUrl}/Api/V1/Employees/${id}`,
          create: `${activeBaseUrl}/Api/V1/Employees`,
          update: (id: string) => `${activeBaseUrl}/Api/V1/Employees/${id}`,
          delete: (id: string) => `${activeBaseUrl}/Api/V1/Employees/${id}`,
          assignedAssets: (id: string) => `${activeBaseUrl}/Api/V1/Employees/${id}/Assets`,
        },
        configurationConstant: {
          base: `${activeBaseUrl}/Api/V1/ConfigurationConstant`,
          getAll: `${activeBaseUrl}/Api/V1/ConfigurationConstant`,
          getByKey: (key: string) => `${activeBaseUrl}/Api/V1/ConfigurationConstant/${key}`,
          addDesignation: `${activeBaseUrl}/Api/V1/ConfigurationConstant/AddDesignation`,
          addDepartment: `${activeBaseUrl}/Api/V1/ConfigurationConstant/AddDepartment`,
          addWorkLocation: `${activeBaseUrl}/Api/V1/ConfigurationConstant/AddWorkLocation`,
          deleteWorkLocation: `${activeBaseUrl}/Api/V1/ConfigurationConstant/DeleteWorkLocation`,
        },
        notifications: {
          base: `${activeBaseUrl}/Api/V1/Notifications`,
          getAll: `${activeBaseUrl}/Api/V1/Notifications`,
          markAsRead: (id: string) => `${activeBaseUrl}/Api/V1/Notifications/MarkAsRead/${id}`,
          markAllAsRead: `${activeBaseUrl}/Api/V1/Notifications/MarkAllAsRead`,
          create: `${activeBaseUrl}/Api/V1/Notifications`,
        },
        deviceServiceRequests: {
          base: `${activeBaseUrl}/Api/V1/DeviceServiceRequests`,
          getAll: `${activeBaseUrl}/Api/V1/DeviceServiceRequests`,
          getMyRequests: `${activeBaseUrl}/Api/V1/DeviceServiceRequests/MyRequests`,
          getById: (id: string) => `${activeBaseUrl}/Api/V1/DeviceServiceRequests/${id}`,
          create: `${activeBaseUrl}/Api/V1/DeviceServiceRequests`,
          update: (id: string) => `${activeBaseUrl}/Api/V1/DeviceServiceRequests/${id}`,
          updateStatus: (id: string) => `${activeBaseUrl}/Api/V1/DeviceServiceRequests/${id}/Status`,
        },
      },
    };
  }
}
