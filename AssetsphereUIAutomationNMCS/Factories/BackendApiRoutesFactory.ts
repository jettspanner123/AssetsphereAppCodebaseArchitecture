export default class BackendApiRoutesFactory {
  public static readonly BASE_URL: string =
    process.env.ASSETSPHERE_BACKEND_BASE_URL || 'https://assetsphereappcodebasearchitecture-op10.onrender.com';

  public static readonly AuthenticationEndpoints = {
    Login: `${BackendApiRoutesFactory.BASE_URL}/Api/V1/Authentication/Login`,
    Register: `${BackendApiRoutesFactory.BASE_URL}/Api/V1/Authentication/Register`,
    RejectUser: (id: string) => `${BackendApiRoutesFactory.BASE_URL}/Api/V1/Authentication/RejectUser/${id}`,
    ApproveUser: (id: string) => `${BackendApiRoutesFactory.BASE_URL}/Api/V1/Authentication/ApproveUser/${id}`,
  } as const;
}
