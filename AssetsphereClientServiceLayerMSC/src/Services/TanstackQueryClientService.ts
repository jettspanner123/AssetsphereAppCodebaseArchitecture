import {
  QueryClient,
  useMutation,
  useQuery,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { LoginCredentials, LoginAuthState } from '../Features/LoginScreen/Models/LoginScreenModel';
import LoginScreenService from '../Features/LoginScreen/Services/LoginScreenService';
import { SignupFormData, SignupAuthState } from '../Features/SignupScreen/Models/SignupScreenModel';
import SignupScreenService from '../Features/SignupScreen/Services/SignupScreenService';
import { Asset } from '../Types/AssetType';
import { CreateAssetRequest } from '../Features/AssetInventory/Services/AssetInventoryService';
import { Employee } from '../Types/EmployeeType';
import { CreateEmployeeRequest } from '../Features/Employees/Services/EmployeesDirectoryService';
import TanstackQueryKeysCON from '../Constants/TanstackQueryKeysCON';

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

  public useAssetsQuery(
    options?: Omit<UseQueryOptions<Asset[], Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<Asset[], Error> {
    return useQuery({
      queryKey: TanstackQueryKeysCON.ASSETS,
      queryFn: async () => {
        const { default: AssetInventoryService } = await import('../Features/AssetInventory/Services/AssetInventoryService');
        return await AssetInventoryService.current.getAllAssets();
      },
      ...options,
    });
  }

  public assetsQuery(
    options?: Omit<UseQueryOptions<Asset[], Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<Asset[], Error> {
    return this.useAssetsQuery(options);
  }

  public useAssetByIdQuery(
    id: string,
    options?: Omit<UseQueryOptions<Asset, Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<Asset, Error> {
    return useQuery({
      queryKey: TanstackQueryKeysCON.ASSET_DETAIL(id),
      queryFn: async () => {
        const { default: AssetInventoryService } = await import('../Features/AssetInventory/Services/AssetInventoryService');
        return await AssetInventoryService.current.getAssetById(id);
      },
      enabled: Boolean(id),
      ...options,
    });
  }

  public useCreateAssetMutation(
    options?: UseMutationOptions<Asset, Error, CreateAssetRequest>
  ): UseMutationResult<Asset, Error, CreateAssetRequest> {
    return useMutation({
      ...options,
      mutationFn: async (request: CreateAssetRequest) => {
        const { default: AssetInventoryService } = await import('../Features/AssetInventory/Services/AssetInventoryService');
        return await AssetInventoryService.current.createAsset(request);
      },
      onSuccess: async (...args) => {
        const [createdAsset] = args;
        this.getClient().setQueryData<Asset[]>(
          TanstackQueryKeysCON.ASSETS,
          (oldAssets) => {
            if (!oldAssets) return [createdAsset];
            const exists = oldAssets.some((a) => a.id === createdAsset.id);
            return exists ? oldAssets : [createdAsset, ...oldAssets];
          }
        );
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.ASSETS });
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.EMPLOYEES });
        (options?.onSuccess as any)?.(...args);
      },
    });
  }

  public createAssetMutation(
    options?: UseMutationOptions<Asset, Error, CreateAssetRequest>
  ): UseMutationResult<Asset, Error, CreateAssetRequest> {
    return this.useCreateAssetMutation(options);
  }

  public useDeleteAssetMutation(
    options?: UseMutationOptions<boolean, Error, string>
  ): UseMutationResult<boolean, Error, string> {
    return useMutation({
      ...options,
      mutationFn: async (id: string) => {
        const { default: AssetInventoryService } = await import('../Features/AssetInventory/Services/AssetInventoryService');
        return await AssetInventoryService.current.deleteAsset(id);
      },
      onSuccess: async (...args) => {
        const [, id] = args;
        this.getClient().setQueryData<Asset[]>(
          TanstackQueryKeysCON.ASSETS,
          (oldAssets) => {
            if (!oldAssets) return [];
            return oldAssets.filter((a) => a.id !== id);
          }
        );
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.ASSETS });
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.EMPLOYEES });
        (options?.onSuccess as any)?.(...args);
      },
    });
  }

  public deleteAssetMutation(
    options?: UseMutationOptions<boolean, Error, string>
  ): UseMutationResult<boolean, Error, string> {
    return this.useDeleteAssetMutation(options);
  }
}

export class EmployeeQueryService {
  constructor(private readonly getClient: () => QueryClient) {}

  public useEmployeesQuery(
    options?: Omit<UseQueryOptions<Employee[], Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<Employee[], Error> {
    return useQuery({
      queryKey: TanstackQueryKeysCON.EMPLOYEES,
      queryFn: async () => {
        const { default: EmployeesDirectoryService } = await import('../Features/Employees/Services/EmployeesDirectoryService');
        return await EmployeesDirectoryService.current.getAllEmployees();
      },
      ...options,
    });
  }

  public employeesQuery(
    options?: Omit<UseQueryOptions<Employee[], Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<Employee[], Error> {
    return this.useEmployeesQuery(options);
  }

  public useEmployeeByIdQuery(
    id: string,
    options?: Omit<UseQueryOptions<Employee, Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<Employee, Error> {
    return useQuery({
      queryKey: TanstackQueryKeysCON.EMPLOYEE_DETAIL(id),
      queryFn: async () => {
        const { default: EmployeesDirectoryService } = await import('../Features/Employees/Services/EmployeesDirectoryService');
        return await EmployeesDirectoryService.current.getEmployeeById(id);
      },
      enabled: Boolean(id),
      ...options,
    });
  }

  public useCreateEmployeeMutation(
    options?: UseMutationOptions<Employee, Error, CreateEmployeeRequest>
  ): UseMutationResult<Employee, Error, CreateEmployeeRequest> {
    return useMutation({
      ...options,
      mutationFn: async (request: CreateEmployeeRequest) => {
        const { default: EmployeesDirectoryService } = await import('../Features/Employees/Services/EmployeesDirectoryService');
        return await EmployeesDirectoryService.current.createEmployee(request);
      },
      onSuccess: async (...args) => {
        const [createdEmp] = args;
        this.getClient().setQueryData<Employee[]>(
          TanstackQueryKeysCON.EMPLOYEES,
          (oldEmployees) => {
            if (!oldEmployees) return [createdEmp];
            const exists = oldEmployees.some((e) => e.id === createdEmp.id);
            return exists ? oldEmployees : [createdEmp, ...oldEmployees];
          }
        );
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.EMPLOYEES });
        (options?.onSuccess as any)?.(...args);
      },
    });
  }

  public createEmployeeMutation(
    options?: UseMutationOptions<Employee, Error, CreateEmployeeRequest>
  ): UseMutationResult<Employee, Error, CreateEmployeeRequest> {
    return this.useCreateEmployeeMutation(options);
  }

  public useUpdateEmployeeMutation(
    options?: UseMutationOptions<Employee, Error, { id: string; request: Partial<CreateEmployeeRequest> }>
  ): UseMutationResult<Employee, Error, { id: string; request: Partial<CreateEmployeeRequest> }> {
    return useMutation({
      ...options,
      mutationFn: async ({ id, request }: { id: string; request: Partial<CreateEmployeeRequest> }) => {
        const { default: EmployeesDirectoryService } = await import('../Features/Employees/Services/EmployeesDirectoryService');
        return await EmployeesDirectoryService.current.updateEmployee(id, request);
      },
      onSuccess: async (...args) => {
        const [updatedEmp] = args;
        this.getClient().setQueryData<Employee[]>(
          TanstackQueryKeysCON.EMPLOYEES,
          (oldEmployees) => {
            if (!oldEmployees) return [updatedEmp];
            return oldEmployees.map((e) => (e.id === updatedEmp.id ? updatedEmp : e));
          }
        );
        this.getClient().setQueryData<Employee>(
          TanstackQueryKeysCON.EMPLOYEE_DETAIL(updatedEmp.id),
          updatedEmp
        );
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.EMPLOYEES });
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.EMPLOYEE_DETAIL(updatedEmp.id) });
        (options?.onSuccess as any)?.(...args);
      },
    });
  }

  public updateEmployeeMutation(
    options?: UseMutationOptions<Employee, Error, { id: string; request: Partial<CreateEmployeeRequest> }>
  ): UseMutationResult<Employee, Error, { id: string; request: Partial<CreateEmployeeRequest> }> {
    return this.useUpdateEmployeeMutation(options);
  }

  public useDeleteEmployeeMutation(
    options?: UseMutationOptions<boolean, Error, string>
  ): UseMutationResult<boolean, Error, string> {
    return useMutation({
      ...options,
      mutationFn: async (id: string) => {
        const { default: EmployeesDirectoryService } = await import('../Features/Employees/Services/EmployeesDirectoryService');
        return await EmployeesDirectoryService.current.deleteEmployee(id);
      },
      onSuccess: async (...args) => {
        const [, id] = args;
        this.getClient().setQueryData<Employee[]>(
          TanstackQueryKeysCON.EMPLOYEES,
          (oldEmployees) => {
            if (!oldEmployees) return [];
            return oldEmployees.filter((e) => e.id !== id);
          }
        );
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.EMPLOYEES });
        (options?.onSuccess as any)?.(...args);
      },
    });
  }

  public deleteEmployeeMutation(
    options?: UseMutationOptions<boolean, Error, string>
  ): UseMutationResult<boolean, Error, string> {
    return this.useDeleteEmployeeMutation(options);
  }
}

export class ConfigurationQueryService {
  constructor(private readonly getClient: () => QueryClient) {}

  public useWorkLocationsQuery(
    options?: Omit<UseQueryOptions<string[], Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<string[], Error> {
    return useQuery({
      queryKey: TanstackQueryKeysCON.WORK_LOCATIONS,
      queryFn: async () => {
        const { default: ConfigurationConstantService } = await import('./ConfigurationConstantService');
        return await ConfigurationConstantService.current.getWorkLocations();
      },
      staleTime: 1000 * 60 * 30, // 30 minutes
      ...options,
    });
  }

  public workLocationsQuery(
    options?: Omit<UseQueryOptions<string[], Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<string[], Error> {
    return this.useWorkLocationsQuery(options);
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
  public readonly employees: EmployeeQueryService = new EmployeeQueryService(() => this.client);
  public readonly configuration: ConfigurationQueryService = new ConfigurationQueryService(() => this.client);
}
