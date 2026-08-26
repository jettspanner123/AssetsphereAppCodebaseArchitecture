export interface NetworkAPIEndpoints {
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

  private readonly defaultBaseUrl: string = 'http://localhost:5125';
  private readonly defaultTimeoutMs: number = 10000;

  public getConfiguration(): ApplicationNetworkAPIConfigurationDetails {
    return {
      baseUrl: this.defaultBaseUrl,
      timeoutMs: this.defaultTimeoutMs,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      endpoints: {
        authentication: {
          login: `${this.defaultBaseUrl}/Api/V1/Authentication/Login`,
          register: `${this.defaultBaseUrl}/Api/V1/Authentication/Register`,
          me: `${this.defaultBaseUrl}/Api/V1/Authentication/Me`,
          refreshToken: `${this.defaultBaseUrl}/Api/V1/Authentication/RefreshToken`,
        },
        assetInventory: {
          base: `${this.defaultBaseUrl}/Api/V1/AssetInventory`,
          getAll: `${this.defaultBaseUrl}/Api/V1/AssetInventory`,
          getById: (id: string) => `${this.defaultBaseUrl}/Api/V1/AssetInventory/${id}`,
          create: `${this.defaultBaseUrl}/Api/V1/AssetInventory`,
          update: (id: string) => `${this.defaultBaseUrl}/Api/V1/AssetInventory/${id}`,
          delete: (id: string) => `${this.defaultBaseUrl}/Api/V1/AssetInventory/${id}`,
        },
        employees: {
          base: `${this.defaultBaseUrl}/Api/V1/Employees`,
          getAll: `${this.defaultBaseUrl}/Api/V1/Employees`,
          getById: (id: string) => `${this.defaultBaseUrl}/Api/V1/Employees/${id}`,
          create: `${this.defaultBaseUrl}/Api/V1/Employees`,
          update: (id: string) => `${this.defaultBaseUrl}/Api/V1/Employees/${id}`,
          delete: (id: string) => `${this.defaultBaseUrl}/Api/V1/Employees/${id}`,
          assignedAssets: (id: string) => `${this.defaultBaseUrl}/Api/V1/Employees/${id}/Assets`,
        },
        configurationConstant: {
          base: `${this.defaultBaseUrl}/Api/V1/ConfigurationConstant`,
          getAll: `${this.defaultBaseUrl}/Api/V1/ConfigurationConstant`,
          getByKey: (key: string) => `${this.defaultBaseUrl}/Api/V1/ConfigurationConstant/${key}`,
          addDesignation: `${this.defaultBaseUrl}/Api/V1/ConfigurationConstant/AddDesignation`,
          addDepartment: `${this.defaultBaseUrl}/Api/V1/ConfigurationConstant/AddDepartment`,
          addWorkLocation: `${this.defaultBaseUrl}/Api/V1/ConfigurationConstant/AddWorkLocation`,
          deleteWorkLocation: `${this.defaultBaseUrl}/Api/V1/ConfigurationConstant/DeleteWorkLocation`,
        },
        notifications: {
          base: `${this.defaultBaseUrl}/Api/V1/Notifications`,
          getAll: `${this.defaultBaseUrl}/Api/V1/Notifications`,
          markAsRead: (id: string) => `${this.defaultBaseUrl}/Api/V1/Notifications/MarkAsRead/${id}`,
          markAllAsRead: `${this.defaultBaseUrl}/Api/V1/Notifications/MarkAllAsRead`,
          create: `${this.defaultBaseUrl}/Api/V1/Notifications`,
        },
        deviceServiceRequests: {
          base: `${this.defaultBaseUrl}/Api/V1/DeviceServiceRequests`,
          getAll: `${this.defaultBaseUrl}/Api/V1/DeviceServiceRequests`,
          getMyRequests: `${this.defaultBaseUrl}/Api/V1/DeviceServiceRequests/MyRequests`,
          getById: (id: string) => `${this.defaultBaseUrl}/Api/V1/DeviceServiceRequests/${id}`,
          create: `${this.defaultBaseUrl}/Api/V1/DeviceServiceRequests`,
          update: (id: string) => `${this.defaultBaseUrl}/Api/V1/DeviceServiceRequests/${id}`,
          updateStatus: (id: string) => `${this.defaultBaseUrl}/Api/V1/DeviceServiceRequests/${id}/Status`,
        },
      },
    };
  }
}
