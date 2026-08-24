import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { LoginCredentials, LoginAuthState } from '../Features/LoginScreen/Models/LoginScreenModel';
import LoginScreenService from '../Features/LoginScreen/Services/LoginScreenService';
import { SignupFormData, SignupAuthState } from '../Features/SignupScreen/Models/SignupScreenModel';
import SignupScreenService from '../Features/SignupScreen/Services/SignupScreenService';
import { Asset } from '../Types/AssetType';
import { CreateAssetRequest } from '../Features/AssetInventory/Services/AssetInventoryService';

export class AuthenticationQueryService {
  // Login Mutations
  public useLoginMutation(
    options?: UseMutationOptions<LoginAuthState, Error, LoginCredentials>
  ): UseMutationResult<LoginAuthState, Error, LoginCredentials> {
    return useMutation({
      mutationFn: async (credentials: LoginCredentials): Promise<LoginAuthState> => {
        return await LoginScreenService.current.authenticateWithCredentials(credentials);
      },
      ...options,
    });
  }

  public loginMutation(
    options?: UseMutationOptions<LoginAuthState, Error, LoginCredentials>
  ): UseMutationResult<LoginAuthState, Error, LoginCredentials> {
    return this.useLoginMutation(options);
  }

  public useMicrosoftLoginMutation(
    options?: UseMutationOptions<LoginAuthState, Error, void>
  ): UseMutationResult<LoginAuthState, Error, void> {
    return useMutation({
      mutationFn: async (): Promise<LoginAuthState> => {
        return await LoginScreenService.current.authenticateWithMicrosoft();
      },
      ...options,
    });
  }

  public microsoftLoginMutation(
    options?: UseMutationOptions<LoginAuthState, Error, void>
  ): UseMutationResult<LoginAuthState, Error, void> {
    return this.useMicrosoftLoginMutation(options);
  }

  // Register Mutations
  public useRegisterMutation(
    options?: UseMutationOptions<SignupAuthState, Error, SignupFormData>
  ): UseMutationResult<SignupAuthState, Error, SignupFormData> {
    return useMutation({
      mutationFn: async (formData: SignupFormData): Promise<SignupAuthState> => {
        return await SignupScreenService.current.registerWithCredentials(formData);
      },
      ...options,
    });
  }

  public registerMutation(
    options?: UseMutationOptions<SignupAuthState, Error, SignupFormData>
  ): UseMutationResult<SignupAuthState, Error, SignupFormData> {
    return this.useRegisterMutation(options);
  }

  public useMicrosoftSignupMutation(
    options?: UseMutationOptions<SignupAuthState, Error, void>
  ): UseMutationResult<SignupAuthState, Error, void> {
    return useMutation({
      mutationFn: async (): Promise<SignupAuthState> => {
        return await SignupScreenService.current.authenticateWithMicrosoft();
      },
      ...options,
    });
  }

  public microsoftSignupMutation(
    options?: UseMutationOptions<SignupAuthState, Error, void>
  ): UseMutationResult<SignupAuthState, Error, void> {
    return this.useMicrosoftSignupMutation(options);
  }
}

export class AssetQueryService {
  constructor(private readonly getClient: () => QueryClient) {}

  public useCreateAssetMutation(
    options?: UseMutationOptions<Asset, Error, CreateAssetRequest>
  ): UseMutationResult<Asset, Error, CreateAssetRequest> {
    return useMutation({
      mutationFn: async (request: CreateAssetRequest) => {
        const { default: AssetInventoryService } = await import('../Features/AssetInventory/Services/AssetInventoryService');
        return await AssetInventoryService.current.createAsset(request);
      },
      onSuccess: (...args) => {
        this.getClient().invalidateQueries({ queryKey: ['assets'] });
        options?.onSuccess?.(...args);
      },
      ...options,
    });
  }

  public createAssetMutation(
    options?: UseMutationOptions<Asset, Error, CreateAssetRequest>
  ): UseMutationResult<Asset, Error, CreateAssetRequest> {
    return this.useCreateAssetMutation(options);
  }
}

export default class TanstackQueryClientService {
  public static current: TanstackQueryClientService = new TanstackQueryClientService();

  public readonly client: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  });

  public readonly authentication: AuthenticationQueryService = new AuthenticationQueryService();
  public readonly assets: AssetQueryService = new AssetQueryService(() => this.client);
}
