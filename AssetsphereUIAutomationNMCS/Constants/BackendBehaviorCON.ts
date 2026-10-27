export default class BackendBehaviorCON {
  // The backend is hosted on Render's free tier and spins down after ~15 minutes
  // idle; the first request after that can take up to ~60s to cold-start. Any
  // assertion waiting on a real backend response uses this budget instead of
  // Playwright's default 5s expect timeout.
  public static readonly COLD_START_TIMEOUT_MS: number = 75_000;
}
