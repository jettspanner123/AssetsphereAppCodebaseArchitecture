import { APIRequestContext } from '@playwright/test';
import BackendAPIRoutesFactory from '../Factories/BackendAPIRoutesFactory';

/**
 * Obtains and caches an admin bearer token via a direct backend API call (no browser
 * involved) - for test setup/teardown that needs authenticated backend access without
 * going through the UI, e.g. cleaning up a test-created pending user registration.
 */
export default class AdminAPIClientUtility {
  public static readonly current: AdminAPIClientUtility = new AdminAPIClientUtility();
  private constructor() {}

  private cachedToken: string | null = null;

  public async getAdminToken(request: APIRequestContext): Promise<string> {
    if (this.cachedToken) {
      return this.cachedToken;
    }

    const adminEmail = process.env.ASSETSPHERE_ADMIN_EMAIL;
    const adminPassword = process.env.ASSETSPHERE_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error(
        'ASSETSPHERE_ADMIN_EMAIL / ASSETSPHERE_ADMIN_PASSWORD are not set. Copy .env.example to .env and fill them in.'
      );
    }

    const response = await request.post(BackendAPIRoutesFactory.AuthenticationEndpoints.Login, {
      data: { email: adminEmail, password: adminPassword },
    });

    if (!response.ok()) {
      throw new Error(`Admin API login failed with HTTP ${response.status()}: ${await response.text()}`);
    }

    const payload = await response.json();
    const token: string | undefined = payload?.data?.accessToken;

    if (!token) {
      throw new Error('Admin API login response did not contain an accessToken.');
    }

    this.cachedToken = token;
    return token;
  }
}
