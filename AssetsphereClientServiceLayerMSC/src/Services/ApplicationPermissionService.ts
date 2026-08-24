import { UserRoleType, TabType } from '@/src/Types';
import useAuthenticationStateStore from '@/src/Store/AuthenticationStateStore';
import ApplicationPermissionCON from '@/src/Constants/ApplicationPermissionCON';

export default class ApplicationPermissionService {
  public static current: ApplicationPermissionService = new ApplicationPermissionService();

  private constructor() {}

  /**
   * Retrieves the currently active user role from the Zustand store.
   */
  public getUserRole(): UserRoleType | null {
    const rawRole = useAuthenticationStateStore.getState().user?.role;
    if (!rawRole) return null;

    // Map string representation to UserRoleType enum if valid
    const upper = String(rawRole).toUpperCase();
    if (upper in UserRoleType) {
      return UserRoleType[upper as keyof typeof UserRoleType];
    }
    return null;
  }

  /**
   * Checks if current user matches a single required role.
   */
  public hasRole(requiredRole: UserRoleType): boolean {
    const userRole = this.getUserRole();
    return userRole === requiredRole;
  }

  /**
   * Checks if current user's role is in the allowed Set of roles.
   */
  public hasPermission(allowedRoles: Set<UserRoleType>): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;
    return allowedRoles.has(userRole);
  }

  /**
   * Convenience helpers
   */
  public isAdmin(): boolean {
    return this.hasRole(UserRoleType.ADMIN);
  }

  public isDeveloper(): boolean {
    return this.hasRole(UserRoleType.DEVELOPER);
  }

  public isOperator(): boolean {
    return this.hasRole(UserRoleType.OPERATOR);
  }

  public isStandardUser(): boolean {
    return this.hasRole(UserRoleType.USER);
  }

  /**
   * Evaluates category visibility for sidebar groupings.
   */
  public canAccessCategory(category: string): boolean {
    const normalized = category.toLowerCase().trim();
    switch (normalized) {
      case 'core':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_CORE_CATEGORY);
      case 'organization':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_ORGANIZATION_CATEGORY);
      case 'operations':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_OPERATIONS_CATEGORY);
      case 'intelligence':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_INTELLIGENCE_CATEGORY);
      default:
        return false;
    }
  }

  /**
   * Evaluates tab access for navigation and route protection.
   */
  public canAccessTab(tabId: TabType): boolean {
    switch (tabId) {
      case 'dashboard':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_TAB_DASHBOARD);
      case 'inventory':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_TAB_INVENTORY);
      case 'licenses':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_TAB_LICENSES);
      case 'cloud':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_TAB_CLOUD);
      case 'employees':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_TAB_EMPLOYEES);
      case 'procurement':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_TAB_PROCUREMENT);
      case 'vendors':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_TAB_VENDORS);
      case 'servicedesk':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_TAB_SERVICEDESK);
      case 'compliance':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_TAB_COMPLIANCE);
      case 'verification':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_TAB_VERIFICATION);
      case 'ai_assistant':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_TAB_AI_ASSISTANT);
      case 'analytics':
        return this.hasPermission(ApplicationPermissionCON.CAN_VIEW_TAB_ANALYTICS);
      default:
        return false;
    }
  }

  /**
   * Checks if user can perform write/edit/delete operations in Core modules.
   */
  public canWriteCore(): boolean {
    return this.hasPermission(ApplicationPermissionCON.CAN_WRITE_CORE_ASSETS);
  }

  /**
   * Checks if user can access System Settings.
   */
  public canAccessSettings(): boolean {
    return this.hasPermission(ApplicationPermissionCON.CAN_ACCESS_SETTINGS);
  }

  /**
   * Checks if user can access Developer Dashboard (/dev).
   */
  public canAccessDevDashboard(): boolean {
    return this.hasPermission(ApplicationPermissionCON.CAN_ACCESS_DEV_DASHBOARD);
  }
}