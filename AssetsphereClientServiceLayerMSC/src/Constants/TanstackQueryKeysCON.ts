export default class TanstackQueryKeysCON {
  public static readonly ASSETS = ['assets'] as const;
  public static readonly ASSET_DETAIL = (id: string) => ['assets', id] as const;
  public static readonly ASSET_QR = (qrId: string) => ['assets', 'qr', qrId] as const;
  public static readonly AUTH_SESSION = ['auth', 'session'] as const;
}
