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
        },
      },
    };
  }
}
