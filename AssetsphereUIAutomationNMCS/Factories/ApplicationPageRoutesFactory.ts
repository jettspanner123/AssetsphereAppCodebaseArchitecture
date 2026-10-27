export default class ApplicationPageRoutesFactory {
  public static readonly AuthenticationRoutes = {
    Login: '/login',
    SignUp: '/signup',
    ForgotPassword: '/forgot-password',
  } as const;

  public static readonly DashboardRoutes = {
    Overview: '/dashboard',
  } as const;
}
