export interface NetworkAPIEndpoints {
  authentication: {
    login: string;
    register: string;
    me: string;
    refreshToken: string;
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
      },
    };
  }
}
