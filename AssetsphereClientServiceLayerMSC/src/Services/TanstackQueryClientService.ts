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
import ApplicationLocalStorageService from './ApplicationLocalStorageService';
import { SignupFormData, SignupAuthState } from '../Features/SignupScreen/Models/SignupScreenModel';
import SignupScreenService from '../Features/SignupScreen/Services/SignupScreenService';
import { Asset } from '../Types/AssetType';
import {
  CreateAssetRequest,
  AssetValuationSummaryResponse,
} from '../Features/AssetInventory/Services/AssetInventoryService';
import { Employee } from '../Types/EmployeeType';
import { CreateEmployeeRequest } from '../Features/Employees/Services/EmployeesDirectoryService';
import {
  SoftwareLicense,
  CreateSoftwareLicenseRequest,
  UpdateSoftwareLicenseRequest,
} from '../Types/SoftwareLicenseType';
import TanstackQueryKeysCON from '../Constants/TanstackQueryKeysCON';

import { PendingUserType, UserProfileType } from '../Types/AuthType';
import UserRequestsService from '../Features/UserRequests/Services/UserRequestsService';

export class AuthenticationQueryService {
  constructor(private readonly getClient?: () => QueryClient) {}

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

  // Pending Users Query (Operator / Admin / Developer)
  public usePendingUsersQuery(
    status: string = 'pending',
    options?: Omit<UseQueryOptions<PendingUserType[], Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<PendingUserType[], Error> {
    return useQuery({
      queryKey: [...TanstackQueryKeysCON.PENDING_USERS, status],
      queryFn: async () => {
        return await UserRequestsService.current.getPendingUsers(status);
      },
      ...options,
    });
  }

  public pendingUsersQuery(
    status: string = 'pending',
    options?: Omit<UseQueryOptions<PendingUserType[], Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<PendingUserType[], Error> {
    return this.usePendingUsersQuery(status, options);
  }

  // Approve User Mutation
  public useApproveUserMutation(
    options?: UseMutationOptions<UserProfileType, Error, string>
  ): UseMutationResult<UserProfileType, Error, string> {
    return useMutation({
      mutationFn: async (id: string) => {
        return await UserRequestsService.current.approveUser(id);
      },
      onSuccess: async (...args) => {
        const [, approvedId] = args;
        this.getClient?.()?.setQueryData<PendingUserType[]>(
          TanstackQueryKeysCON.PENDING_USERS,
          (old) => (old ? old.filter((u) => u.id !== approvedId) : [])
        );
        await this.getClient?.()?.invalidateQueries({ queryKey: TanstackQueryKeysCON.PENDING_USERS });
        (options?.onSuccess as any)?.(...args);
      },
      ...options,
    });
  }

  public approveUserMutation(
    options?: UseMutationOptions<UserProfileType, Error, string>
  ): UseMutationResult<UserProfileType, Error, string> {
    return this.useApproveUserMutation(options);
  }

  // Reject User Mutation
  public useRejectUserMutation(
    options?: UseMutationOptions<boolean, Error, string>
  ): UseMutationResult<boolean, Error, string> {
    return useMutation({
      mutationFn: async (id: string) => {
        return await UserRequestsService.current.rejectUser(id);
      },
      onSuccess: async (...args) => {
        const [, rejectedId] = args;
        this.getClient?.()?.setQueryData<PendingUserType[]>(
          TanstackQueryKeysCON.PENDING_USERS,
          (old) => (old ? old.filter((u) => u.id !== rejectedId) : [])
        );
        await this.getClient?.()?.invalidateQueries({ queryKey: TanstackQueryKeysCON.PENDING_USERS });
        (options?.onSuccess as any)?.(...args);
      },
      ...options,
    });
  }

  public rejectUserMutation(
    options?: UseMutationOptions<boolean, Error, string>
  ): UseMutationResult<boolean, Error, string> {
    return this.useRejectUserMutation(options);
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

  public useAssetValuationSummaryQuery(
    assetIds?: string[],
    options?: Omit<UseQueryOptions<AssetValuationSummaryResponse, Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<AssetValuationSummaryResponse, Error> {
    return useQuery({
      queryKey: TanstackQueryKeysCON.ASSET_VALUATION_SUMMARY(assetIds),
      queryFn: async () => {
        const { default: AssetInventoryService } = await import('../Features/AssetInventory/Services/AssetInventoryService');
        return await AssetInventoryService.current.getValuationSummary(assetIds);
      },
      ...options,
    });
  }

  public assetValuationSummaryQuery(
    assetIds?: string[],
    options?: Omit<UseQueryOptions<AssetValuationSummaryResponse, Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<AssetValuationSummaryResponse, Error> {
    return this.useAssetValuationSummaryQuery(assetIds, options);
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
        await this.getClient().invalidateQueries({ queryKey: ['assets', 'valuation-summary'] });
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

  public useUpdateAssetMutation(
    options?: UseMutationOptions<Asset, Error, { id: string; data: Partial<CreateAssetRequest> }>
  ): UseMutationResult<Asset, Error, { id: string; data: Partial<CreateAssetRequest> }> {
    return useMutation({
      ...options,
      mutationFn: async ({ id, data }) => {
        const { default: AssetInventoryService } = await import('../Features/AssetInventory/Services/AssetInventoryService');
        return await AssetInventoryService.current.updateAsset(id, data);
      },
      onSuccess: async (...args) => {
        const [updatedAsset] = args;
        this.getClient().setQueryData<Asset[]>(
          TanstackQueryKeysCON.ASSETS,
          (oldAssets) => {
            if (!oldAssets) return [updatedAsset];
            return oldAssets.map((a) => (a.id === updatedAsset.id ? updatedAsset : a));
          }
        );
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.ASSETS });
        await this.getClient().invalidateQueries({ queryKey: ['assets', 'valuation-summary'] });
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.EMPLOYEES });
        (options?.onSuccess as any)?.(...args);
      },
    });
  }

  public updateAssetMutation(
    options?: UseMutationOptions<Asset, Error, { id: string; data: Partial<CreateAssetRequest> }>
  ): UseMutationResult<Asset, Error, { id: string; data: Partial<CreateAssetRequest> }> {
    return this.useUpdateAssetMutation(options);
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
        await this.getClient().invalidateQueries({ queryKey: ['assets', 'valuation-summary'] });
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

  public useDesignationsQuery(
    options?: Omit<UseQueryOptions<Record<string, string[]>, Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<Record<string, string[]>, Error> {
    return useQuery({
      queryKey: TanstackQueryKeysCON.EMPLOYEE_DESIGNATIONS,
      queryFn: async () => {
        const { default: ConfigurationConstantService } = await import('./ConfigurationConstantService');
        return await ConfigurationConstantService.current.getDesignations();
      },
      staleTime: 1000 * 60 * 30, // 30 minutes
      ...options,
    });
  }

  public designationsQuery(
    options?: Omit<UseQueryOptions<Record<string, string[]>, Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<Record<string, string[]>, Error> {
    return this.useDesignationsQuery(options);
  }

  public useAddDesignationMutation(
    options?: Omit<UseMutationOptions<Record<string, string[]>, Error, { department: string; designation: string }>, 'mutationFn'>
  ): UseMutationResult<Record<string, string[]>, Error, { department: string; designation: string }> {
    return useMutation({
      mutationFn: async ({ department, designation }: { department: string; designation: string }) => {
        const { default: ConfigurationConstantService } = await import('./ConfigurationConstantService');
        return await ConfigurationConstantService.current.addDesignation(department, designation);
      },
      onSuccess: (data) => {
        this.getClient().setQueryData(TanstackQueryKeysCON.EMPLOYEE_DESIGNATIONS, data);
        this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.EMPLOYEE_DESIGNATIONS });
      },
      ...options,
    });
  }

  public useAddDepartmentMutation(
    options?: Omit<UseMutationOptions<Record<string, string[]>, Error, { department: string }>, 'mutationFn'>
  ): UseMutationResult<Record<string, string[]>, Error, { department: string }> {
    return useMutation({
      mutationFn: async ({ department }: { department: string }) => {
        const { default: ConfigurationConstantService } = await import('./ConfigurationConstantService');
        return await ConfigurationConstantService.current.addDepartment(department);
      },
      onSuccess: (data) => {
        this.getClient().setQueryData(TanstackQueryKeysCON.EMPLOYEE_DESIGNATIONS, data);
        this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.EMPLOYEE_DESIGNATIONS });
      },
      ...options,
    });
  }

  public useAddWorkLocationMutation(
    options?: Omit<UseMutationOptions<string[], Error, { location: string }>, 'mutationFn'>
  ): UseMutationResult<string[], Error, { location: string }> {
    return useMutation({
      mutationFn: async ({ location }: { location: string }) => {
        const { default: ConfigurationConstantService } = await import('./ConfigurationConstantService');
        return await ConfigurationConstantService.current.addWorkLocation(location);
      },
      onSuccess: (data) => {
        this.getClient().setQueryData(TanstackQueryKeysCON.WORK_LOCATIONS, data);
        this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.WORK_LOCATIONS });
      },
      ...options,
    });
  }

  public useDeleteWorkLocationMutation(
    options?: Omit<UseMutationOptions<string[], Error, { location: string }>, 'mutationFn'>
  ): UseMutationResult<string[], Error, { location: string }> {
    return useMutation({
      mutationFn: async ({ location }: { location: string }) => {
        const { default: ConfigurationConstantService } = await import('./ConfigurationConstantService');
        return await ConfigurationConstantService.current.deleteWorkLocation(location);
      },
      onSuccess: (data) => {
        this.getClient().setQueryData(TanstackQueryKeysCON.WORK_LOCATIONS, data);
        this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.WORK_LOCATIONS });
      },
      ...options,
    });
  }
}

export class NotificationQueryService {
  constructor(private readonly getClient: () => QueryClient) {}

  public useNotificationsQuery(
    userId?: string,
    role?: string,
    options?: Omit<UseQueryOptions<import('../Types/NotificationType').NotificationItemType[], Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<import('../Types/NotificationType').NotificationItemType[], Error> {
    return useQuery({
      queryKey: TanstackQueryKeysCON.NOTIFICATIONS,
      queryFn: async () => {
        const { default: NotificationsService } = await import('../Features/Notifications/Services/NotificationsService');
        return await NotificationsService.current.getNotifications(userId, role);
      },
      refetchInterval: 15000, // 15s auto-poll
      ...options,
    });
  }

  public useMarkNotificationAsReadMutation(
    options?: Omit<UseMutationOptions<import('../Types/NotificationType').NotificationItemType, Error, { id: string; userId?: string }>, 'mutationFn'>
  ): UseMutationResult<import('../Types/NotificationType').NotificationItemType, Error, { id: string; userId?: string }> {
    return useMutation({
      mutationFn: async ({ id, userId }: { id: string; userId?: string }) => {
        const { default: NotificationsService } = await import('../Features/Notifications/Services/NotificationsService');
        return await NotificationsService.current.markAsRead(id, userId);
      },
      onSuccess: () => {
        this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.NOTIFICATIONS });
      },
      ...options,
    });
  }

  public useMarkAllNotificationsAsReadMutation(
    options?: Omit<UseMutationOptions<number, Error, { userId?: string; role?: string } | void>, 'mutationFn'>
  ): UseMutationResult<number, Error, { userId?: string; role?: string } | void> {
    return useMutation({
      mutationFn: async (params?: { userId?: string; role?: string } | void) => {
        const { default: NotificationsService } = await import('../Features/Notifications/Services/NotificationsService');
        return await NotificationsService.current.markAllAsRead(params?.userId, params?.role);
      },
      onSuccess: () => {
        this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.NOTIFICATIONS });
      },
      ...options,
    });
  }

  public useCreateNotificationMutation(
    options?: Omit<UseMutationOptions<import('../Types/NotificationType').NotificationItemType, Error, import('../Types/NotificationType').CreateNotificationRequest>, 'mutationFn'>
  ): UseMutationResult<import('../Types/NotificationType').NotificationItemType, Error, import('../Types/NotificationType').CreateNotificationRequest> {
    return useMutation({
      mutationFn: async (request: import('../Types/NotificationType').CreateNotificationRequest) => {
        const { default: NotificationsService } = await import('../Features/Notifications/Services/NotificationsService');
        return await NotificationsService.current.createNotification(request);
      },
      onSuccess: () => {
        this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.NOTIFICATIONS });
      },
      ...options,
    });
  }
}

export class DeviceServiceRequestsQueryService {
  constructor(private readonly getClient: () => QueryClient) {}

  public useDeviceServiceRequestsQuery(
    status?: string,
    userId?: string,
    options?: Omit<
      UseQueryOptions<
        import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType[],
        Error,
        import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType[],
        readonly unknown[]
      >,
      'queryKey' | 'queryFn'
    >
  ): UseQueryResult<import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType[], Error> {
    return useQuery({
      queryKey: status || userId ? [...TanstackQueryKeysCON.DEVICE_SERVICE_REQUESTS, { status, userId }] : TanstackQueryKeysCON.DEVICE_SERVICE_REQUESTS,
      queryFn: async () => {
        const { default: DeviceServiceRequestsService } = await import('../Features/DeviceServiceRequests/Services/DeviceServiceRequestsService');
        return await DeviceServiceRequestsService.current.getAllRequests(status, userId);
      },
      refetchInterval: 15000, // 15s auto-poll for status updates
      ...options,
    });
  }

  public useMyDeviceServiceRequestsQuery(
    userId?: string,
    options?: Omit<
      UseQueryOptions<
        import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType[],
        Error,
        import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType[],
        readonly unknown[]
      >,
      'queryKey' | 'queryFn'
    >
  ): UseQueryResult<import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType[], Error> {
    return useQuery({
      queryKey: [...TanstackQueryKeysCON.MY_DEVICE_SERVICE_REQUESTS, userId || 'current'],
      queryFn: async () => {
        const { default: DeviceServiceRequestsService } = await import('../Features/DeviceServiceRequests/Services/DeviceServiceRequestsService');
        return await DeviceServiceRequestsService.current.getMyRequests(userId);
      },
      refetchInterval: 15000,
      ...options,
    });
  }

  public useCreateDeviceServiceRequestMutation(
    options?: Omit<
      UseMutationOptions<
        import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType,
        Error,
        import('../Types/DeviceServiceRequestType').CreateDeviceServiceRequestInput
      >,
      'mutationFn'
    >
  ): UseMutationResult<
    import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType,
    Error,
    import('../Types/DeviceServiceRequestType').CreateDeviceServiceRequestInput
  > {
    return useMutation({
      ...options,
      mutationFn: async (input: import('../Types/DeviceServiceRequestType').CreateDeviceServiceRequestInput) => {
        const { default: DeviceServiceRequestsService } = await import('../Features/DeviceServiceRequests/Services/DeviceServiceRequestsService');
        return await DeviceServiceRequestsService.current.createRequest(input);
      },
      onMutate: async (input) => {
        await this.getClient().cancelQueries({ queryKey: TanstackQueryKeysCON.DEVICE_SERVICE_REQUESTS });
        const previousQueries = this.getClient().getQueriesData<
          import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType[]
        >({ queryKey: TanstackQueryKeysCON.DEVICE_SERVICE_REQUESTS });

        const session = ApplicationLocalStorageService.current.getAuthSession();
        const currentUserId = session?.user?.id || '';
        const currentUserName = session?.userName || session?.user?.fullName || 'You';
        const currentUserEmail = session?.userEmail || session?.user?.email || '';
        const currentUserRole = session?.userRole || (session?.user?.role as string) || '';
        const nowIso = new Date().toISOString();

        const optimisticRequest: import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType = {
          id: `optimistic-${Date.now()}`,
          requestNumber: 'Submitting...',
          requesterUserId: currentUserId,
          requesterName: currentUserName,
          requesterEmail: currentUserEmail,
          requesterRole: currentUserRole,
          targetUserId: input.targetUserId || currentUserId,
          targetUserName: input.targetUserName || currentUserName,
          targetUserEmail: input.targetUserEmail || currentUserEmail,
          assetId: input.assetId,
          assetTag: input.assetTag,
          assetName: input.assetName,
          serviceCategory: input.serviceCategory,
          componentSubtype: input.componentSubtype,
          usabilityState: input.usabilityState,
          serviceChannel: input.serviceChannel,
          urgency: input.urgency,
          workLocation: input.workLocation,
          descriptionRichText: input.descriptionRichText,
          status: 'PENDING',
          createdAt: nowIso,
          createdBy: currentUserName,
        };

        this.getClient().setQueriesData<
          import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType[]
        >(
          { queryKey: TanstackQueryKeysCON.DEVICE_SERVICE_REQUESTS },
          (old) => (old ? [optimisticRequest, ...old] : [optimisticRequest])
        );

        (options?.onMutate as any)?.(input);
        return { previousQueries };
      },
      onError: (err, variables, context: any) => {
        context?.previousQueries?.forEach(([key, data]: [readonly unknown[], unknown]) => {
          this.getClient().setQueryData(key, data);
        });
        (options?.onError as any)?.(err, variables, context);
      },
      onSettled: async (...args) => {
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.DEVICE_SERVICE_REQUESTS });
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.MY_DEVICE_SERVICE_REQUESTS });
        (options?.onSettled as any)?.(...args);
      },
    });
  }

  public useUpdateDeviceServiceRequestStatusMutation(
    options?: Omit<
      UseMutationOptions<
        import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType,
        Error,
        { id: string; input: import('../Types/DeviceServiceRequestType').UpdateDeviceServiceRequestStatusInput }
      >,
      'mutationFn'
    >
  ): UseMutationResult<
    import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType,
    Error,
    { id: string; input: import('../Types/DeviceServiceRequestType').UpdateDeviceServiceRequestStatusInput }
  > {
    return useMutation({
      ...options,
      mutationFn: async ({ id, input }) => {
        const { default: DeviceServiceRequestsService } = await import('../Features/DeviceServiceRequests/Services/DeviceServiceRequestsService');
        return await DeviceServiceRequestsService.current.updateRequestStatus(id, input);
      },
      onMutate: async (variables) => {
        const { id, input } = variables;
        await this.getClient().cancelQueries({ queryKey: TanstackQueryKeysCON.DEVICE_SERVICE_REQUESTS });
        const previousQueries = this.getClient().getQueriesData<
          import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType[]
        >({ queryKey: TanstackQueryKeysCON.DEVICE_SERVICE_REQUESTS });

        const nowIso = new Date().toISOString();
        this.getClient().setQueriesData<
          import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType[]
        >(
          { queryKey: TanstackQueryKeysCON.DEVICE_SERVICE_REQUESTS },
          (old) =>
            old?.map((r) =>
              r.id === id
                ? { ...r, status: input.status, resolutionNotes: input.resolutionNotes ?? r.resolutionNotes, updatedAt: nowIso }
                : r
            )
        );

        (options?.onMutate as any)?.(variables);
        return { previousQueries };
      },
      onError: (err, variables, context: any) => {
        context?.previousQueries?.forEach(([key, data]: [readonly unknown[], unknown]) => {
          this.getClient().setQueryData(key, data);
        });
        (options?.onError as any)?.(err, variables, context);
      },
      onSettled: async (...args) => {
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.DEVICE_SERVICE_REQUESTS });
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.MY_DEVICE_SERVICE_REQUESTS });
        (options?.onSettled as any)?.(...args);
      },
    });
  }

  public useAdminUpdateDeviceServiceRequestMutation(
    options?: Omit<
      UseMutationOptions<
        import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType,
        Error,
        { id: string; input: import('../Types/DeviceServiceRequestType').AdminUpdateDeviceServiceRequestInput }
      >,
      'mutationFn'
    >
  ): UseMutationResult<
    import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType,
    Error,
    { id: string; input: import('../Types/DeviceServiceRequestType').AdminUpdateDeviceServiceRequestInput }
  > {
    return useMutation({
      ...options,
      mutationFn: async ({ id, input }) => {
        const { default: DeviceServiceRequestsService } = await import('../Features/DeviceServiceRequests/Services/DeviceServiceRequestsService');
        return await DeviceServiceRequestsService.current.adminUpdateRequest(id, input);
      },
      onMutate: async (variables) => {
        const { id, input } = variables;
        await this.getClient().cancelQueries({ queryKey: TanstackQueryKeysCON.DEVICE_SERVICE_REQUESTS });
        const previousQueries = this.getClient().getQueriesData<
          import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType[]
        >({ queryKey: TanstackQueryKeysCON.DEVICE_SERVICE_REQUESTS });

        const nowIso = new Date().toISOString();
        this.getClient().setQueriesData<
          import('../Types/DeviceServiceRequestType').DeviceServiceRequestItemType[]
        >(
          { queryKey: TanstackQueryKeysCON.DEVICE_SERVICE_REQUESTS },
          (old) => old?.map((r) => (r.id === id ? { ...r, ...input, updatedAt: nowIso } : r))
        );

        (options?.onMutate as any)?.(variables);
        return { previousQueries };
      },
      onError: (err, variables, context: any) => {
        context?.previousQueries?.forEach(([key, data]: [readonly unknown[], unknown]) => {
          this.getClient().setQueryData(key, data);
        });
        (options?.onError as any)?.(err, variables, context);
      },
      onSettled: async (...args) => {
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.DEVICE_SERVICE_REQUESTS });
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.MY_DEVICE_SERVICE_REQUESTS });
        (options?.onSettled as any)?.(...args);
      },
    });
  }
}

export class SoftwareLicensesQueryService {
  constructor(private readonly getClient: () => QueryClient) {}

  private isLicenseListQueryKey(key: readonly unknown[]): boolean {
    return key.length === 1 || (key.length === 2 && typeof key[1] === 'object' && key[1] !== null);
  }

  private applyLicensePatch(existing: SoftwareLicense, patch: UpdateSoftwareLicenseRequest): SoftwareLicense {
    let assignedDepartments = existing.assignedDepartments;
    if (patch.assignedDepartmentsJson !== undefined) {
      try {
        const parsed = JSON.parse(patch.assignedDepartmentsJson);
        assignedDepartments = Array.isArray(parsed) ? parsed : existing.assignedDepartments;
      } catch {
        assignedDepartments = existing.assignedDepartments;
      }
    }

    return {
      ...existing,
      softwareName: patch.softwareName ?? existing.softwareName,
      publisher: patch.publisher ?? existing.publisher,
      version: patch.version ?? existing.version,
      category: patch.category ?? existing.category,
      licenseKey: patch.licenseKey ?? existing.licenseKey,
      licenseType: patch.licenseType ?? existing.licenseType,
      totalSeats: patch.totalSeats ?? existing.totalSeats,
      allocatedSeats: patch.assignedSeats ?? existing.allocatedSeats,
      costPerSeat: patch.costPerSeat ?? existing.costPerSeat,
      annualCost: patch.annualCost ?? existing.annualCost,
      currency: patch.currency ?? existing.currency,
      purchaseDate: patch.purchaseDate ?? existing.purchaseDate,
      expirationDate: patch.expiryDate ?? existing.expirationDate,
      complianceStatus: patch.complianceStatus ?? existing.complianceStatus,
      assignedDepartments,
    };
  }

  public useSoftwareLicensesQuery(
    category?: string,
    complianceStatus?: string,
    search?: string,
    options?: Omit<
      UseQueryOptions<SoftwareLicense[], Error, SoftwareLicense[], readonly unknown[]>,
      'queryKey' | 'queryFn'
    >
  ): UseQueryResult<SoftwareLicense[], Error> {
    return useQuery({
      queryKey:
        category || complianceStatus || search
          ? [...TanstackQueryKeysCON.SOFTWARE_LICENSES, { category, complianceStatus, search }]
          : TanstackQueryKeysCON.SOFTWARE_LICENSES,
      queryFn: async () => {
        const { default: SoftwareLicensesService } = await import('../Features/SoftwareLicenses/Services/SoftwareLicensesService');
        return await SoftwareLicensesService.current.getAllLicenses(category, complianceStatus, search);
      },
      refetchInterval: 30000,
      ...options,
    });
  }

  public useSoftwareLicenseDetailQuery(
    id: string,
    options?: Omit<UseQueryOptions<SoftwareLicense, Error, SoftwareLicense, readonly unknown[]>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<SoftwareLicense, Error> {
    return useQuery({
      queryKey: TanstackQueryKeysCON.SOFTWARE_LICENSE_DETAIL(id),
      queryFn: async () => {
        const { default: SoftwareLicensesService } = await import('../Features/SoftwareLicenses/Services/SoftwareLicensesService');
        return await SoftwareLicensesService.current.getLicenseById(id);
      },
      enabled: Boolean(id),
      ...options,
    });
  }

  public useCreateSoftwareLicenseMutation(
    options?: Omit<UseMutationOptions<SoftwareLicense, Error, CreateSoftwareLicenseRequest>, 'mutationFn'>
  ): UseMutationResult<SoftwareLicense, Error, CreateSoftwareLicenseRequest> {
    return useMutation({
      ...options,
      mutationFn: async (request: CreateSoftwareLicenseRequest) => {
        const { default: SoftwareLicensesService } = await import('../Features/SoftwareLicenses/Services/SoftwareLicensesService');
        return await SoftwareLicensesService.current.createLicense(request);
      },
      onMutate: async (request) => {
        await this.getClient().cancelQueries({ queryKey: TanstackQueryKeysCON.SOFTWARE_LICENSES });
        const previousQueries = this.getClient().getQueriesData<SoftwareLicense[]>({
          queryKey: TanstackQueryKeysCON.SOFTWARE_LICENSES,
          predicate: (query) => this.isLicenseListQueryKey(query.queryKey as readonly unknown[]),
        });

        let assignedDepartments: string[] = [];
        if (request.assignedDepartmentsJson) {
          try {
            const parsed = JSON.parse(request.assignedDepartmentsJson);
            if (Array.isArray(parsed)) assignedDepartments = parsed;
          } catch {}
        }

        const optimisticLicense: SoftwareLicense = {
          id: `optimistic-${Date.now()}`,
          softwareName: request.softwareName,
          publisher: request.publisher,
          version: request.version,
          category: request.category,
          licenseKey: request.licenseKey,
          licenseType: request.licenseType,
          totalSeats: request.totalSeats,
          allocatedSeats: request.assignedSeats || 0,
          costPerSeat: request.costPerSeat,
          annualCost: request.annualCost ?? request.costPerSeat * request.totalSeats,
          currency: request.currency || 'USD',
          purchaseDate: request.purchaseDate || new Date().toISOString().split('T')[0],
          expirationDate: request.expiryDate,
          complianceStatus: request.complianceStatus || 'Compliant',
          assignedDepartments,
        };

        this.getClient().setQueriesData<SoftwareLicense[]>(
          {
            queryKey: TanstackQueryKeysCON.SOFTWARE_LICENSES,
            predicate: (query) => this.isLicenseListQueryKey(query.queryKey as readonly unknown[]),
          },
          (old) => (old ? [optimisticLicense, ...old] : [optimisticLicense])
        );

        (options?.onMutate as any)?.(request);
        return { previousQueries };
      },
      onError: (err, variables, context: any) => {
        context?.previousQueries?.forEach(([key, data]: [readonly unknown[], unknown]) => {
          this.getClient().setQueryData(key, data);
        });
        (options?.onError as any)?.(err, variables, context);
      },
      onSuccess: async (...args) => {
        if (options?.onSuccess) {
          options.onSuccess(...args);
        }
      },
      onSettled: async (...args) => {
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.SOFTWARE_LICENSES });
        (options?.onSettled as any)?.(...args);
      },
    });
  }

  public useUpdateSoftwareLicenseMutation(
    options?: Omit<UseMutationOptions<SoftwareLicense, Error, { id: string; request: UpdateSoftwareLicenseRequest }>, 'mutationFn'>
  ): UseMutationResult<SoftwareLicense, Error, { id: string; request: UpdateSoftwareLicenseRequest }> {
    return useMutation({
      ...options,
      mutationFn: async ({ id, request }) => {
        const { default: SoftwareLicensesService } = await import('../Features/SoftwareLicenses/Services/SoftwareLicensesService');
        return await SoftwareLicensesService.current.updateLicense(id, request);
      },
      onMutate: async (variables) => {
        const { id, request } = variables;
        await this.getClient().cancelQueries({ queryKey: TanstackQueryKeysCON.SOFTWARE_LICENSES });
        const previousQueries = this.getClient().getQueriesData<SoftwareLicense[]>({
          queryKey: TanstackQueryKeysCON.SOFTWARE_LICENSES,
          predicate: (query) => this.isLicenseListQueryKey(query.queryKey as readonly unknown[]),
        });
        const previousDetail = this.getClient().getQueryData<SoftwareLicense>(
          TanstackQueryKeysCON.SOFTWARE_LICENSE_DETAIL(id)
        );

        this.getClient().setQueriesData<SoftwareLicense[]>(
          {
            queryKey: TanstackQueryKeysCON.SOFTWARE_LICENSES,
            predicate: (query) => this.isLicenseListQueryKey(query.queryKey as readonly unknown[]),
          },
          (old) => old?.map((license) => (license.id === id ? this.applyLicensePatch(license, request) : license))
        );
        if (previousDetail) {
          this.getClient().setQueryData<SoftwareLicense>(
            TanstackQueryKeysCON.SOFTWARE_LICENSE_DETAIL(id),
            this.applyLicensePatch(previousDetail, request)
          );
        }

        (options?.onMutate as any)?.(variables);
        return { previousQueries, previousDetail, id };
      },
      onError: (err, variables, context: any) => {
        context?.previousQueries?.forEach(([key, data]: [readonly unknown[], unknown]) => {
          this.getClient().setQueryData(key, data);
        });
        if (context?.previousDetail && context?.id) {
          this.getClient().setQueryData(TanstackQueryKeysCON.SOFTWARE_LICENSE_DETAIL(context.id), context.previousDetail);
        }
        (options?.onError as any)?.(err, variables, context);
      },
      onSuccess: async (...args) => {
        if (options?.onSuccess) {
          options.onSuccess(...args);
        }
      },
      onSettled: async (data, error, variables, ...rest) => {
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.SOFTWARE_LICENSES });
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.SOFTWARE_LICENSE_DETAIL(variables.id) });
        (options?.onSettled as any)?.(data, error, variables, ...rest);
      },
    });
  }

  public useDeleteSoftwareLicenseMutation(
    options?: Omit<UseMutationOptions<boolean, Error, string>, 'mutationFn'>
  ): UseMutationResult<boolean, Error, string> {
    return useMutation({
      ...options,
      mutationFn: async (id: string) => {
        const { default: SoftwareLicensesService } = await import('../Features/SoftwareLicenses/Services/SoftwareLicensesService');
        return await SoftwareLicensesService.current.deleteLicense(id);
      },
      onMutate: async (id) => {
        await this.getClient().cancelQueries({ queryKey: TanstackQueryKeysCON.SOFTWARE_LICENSES });
        const previousQueries = this.getClient().getQueriesData<SoftwareLicense[]>({
          queryKey: TanstackQueryKeysCON.SOFTWARE_LICENSES,
          predicate: (query) => this.isLicenseListQueryKey(query.queryKey as readonly unknown[]),
        });

        this.getClient().setQueriesData<SoftwareLicense[]>(
          {
            queryKey: TanstackQueryKeysCON.SOFTWARE_LICENSES,
            predicate: (query) => this.isLicenseListQueryKey(query.queryKey as readonly unknown[]),
          },
          (old) => old?.filter((license) => license.id !== id)
        );

        (options?.onMutate as any)?.(id);
        return { previousQueries };
      },
      onError: (err, variables, context: any) => {
        context?.previousQueries?.forEach(([key, data]: [readonly unknown[], unknown]) => {
          this.getClient().setQueryData(key, data);
        });
        (options?.onError as any)?.(err, variables, context);
      },
      onSuccess: async (...args) => {
        if (options?.onSuccess) {
          options.onSuccess(...args);
        }
      },
      onSettled: async (...args) => {
        await this.getClient().invalidateQueries({ queryKey: TanstackQueryKeysCON.SOFTWARE_LICENSES });
        (options?.onSettled as any)?.(...args);
      },
    });
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

  public readonly authentication: AuthenticationQueryService = new AuthenticationQueryService(() => this.client);
  public readonly assets: AssetQueryService = new AssetQueryService(() => this.client);
  public readonly employees: EmployeeQueryService = new EmployeeQueryService(() => this.client);
  public readonly configuration: ConfigurationQueryService = new ConfigurationQueryService(() => this.client);
  public readonly notifications: NotificationQueryService = new NotificationQueryService(() => this.client);
  public readonly deviceServiceRequests: DeviceServiceRequestsQueryService = new DeviceServiceRequestsQueryService(() => this.client);
  public readonly softwareLicenses: SoftwareLicensesQueryService = new SoftwareLicensesQueryService(() => this.client);
}
