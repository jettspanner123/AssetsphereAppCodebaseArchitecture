export default class BackendAPIRoutesFactory {
  public static readonly BASE_URL: string =
    process.env.ASSETSPHERE_BACKEND_BASE_URL || 'https://assetsphereappcodebasearchitecture-op10.onrender.com';

  public static readonly AuthenticationEndpoints = {
    Login: `${BackendAPIRoutesFactory.BASE_URL}/Api/V1/Authentication/Login`,
    Register: `${BackendAPIRoutesFactory.BASE_URL}/Api/V1/Authentication/Register`,
    RejectUser: (id: string) => `${BackendAPIRoutesFactory.BASE_URL}/Api/V1/Authentication/RejectUser/${id}`,
    ApproveUser: (id: string) => `${BackendAPIRoutesFactory.BASE_URL}/Api/V1/Authentication/ApproveUser/${id}`,
  } as const;

  public static readonly AssetInventoryEndpoints = {
    DeleteAsset: (id: string) => `${BackendAPIRoutesFactory.BASE_URL}/Api/V1/AssetInventory/${id}`,
  } as const;
}
