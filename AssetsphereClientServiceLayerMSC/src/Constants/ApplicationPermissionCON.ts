import ApplicationPermissionPreset from '@/src/Presets/ApplicationPermissionPreset';
import { UserRoleType } from '@/src/Types';

export default class ApplicationPermissionCON {
  // Category Visibility Permissions
  public static readonly CAN_VIEW_CORE_CATEGORY: Set<UserRoleType> =
    ApplicationPermissionPreset.current.allRoles();
  public static readonly CAN_VIEW_ORGANIZATION_CATEGORY: Set<UserRoleType> =
    ApplicationPermissionPreset.current.operatorRolePreset();
  public static readonly CAN_VIEW_OPERATIONS_CATEGORY: Set<UserRoleType> =
    ApplicationPermissionPreset.current.managementRoles();
  public static readonly CAN_VIEW_INTELLIGENCE_CATEGORY: Set<UserRoleType> =
    ApplicationPermissionPreset.current.managementRoles();

  // Backward compatibility alias
  public static readonly CAN_VIEW_CORE_OPTIONS = ApplicationPermissionCON.CAN_VIEW_CORE_CATEGORY;
  public static readonly CAN_VIEW_ORGANISATION_OPTIONS = ApplicationPermissionCON.CAN_VIEW_ORGANIZATION_CATEGORY;
  public static readonly CAN_VIEW_OPERATIONS_OPTIONS = ApplicationPermissionCON.CAN_VIEW_OPERATIONS_CATEGORY;
  public static readonly CAN_VIEW_INTELLIGENCE_OPTIONS = ApplicationPermissionCON.CAN_VIEW_INTELLIGENCE_CATEGORY;

  // Granular Tab Visibility Permissions
  public static readonly CAN_VIEW_TAB_DASHBOARD: Set<UserRoleType> =
    ApplicationPermissionPreset.current.allRoles();
  public static readonly CAN_VIEW_TAB_INVENTORY: Set<UserRoleType> =
    ApplicationPermissionPreset.current.allRoles();
  public static readonly CAN_VIEW_TAB_LICENSES: Set<UserRoleType> =
    ApplicationPermissionPreset.current.allRoles();
  public static readonly CAN_VIEW_TAB_CLOUD: Set<UserRoleType> =
    ApplicationPermissionPreset.current.managementRoles();

  public static readonly CAN_VIEW_TAB_EMPLOYEES: Set<UserRoleType> =
    ApplicationPermissionPreset.current.operatorRolePreset();
  public static readonly CAN_VIEW_TAB_PROCUREMENT: Set<UserRoleType> =
    ApplicationPermissionPreset.current.managementRoles();
  public static readonly CAN_VIEW_TAB_VENDORS: Set<UserRoleType> =
    ApplicationPermissionPreset.current.managementRoles();

  public static readonly CAN_VIEW_TAB_SERVICEDESK: Set<UserRoleType> =
    ApplicationPermissionPreset.current.managementRoles();
  public static readonly CAN_VIEW_TAB_COMPLIANCE: Set<UserRoleType> =
    ApplicationPermissionPreset.current.managementRoles();
  public static readonly CAN_VIEW_TAB_VERIFICATION: Set<UserRoleType> =
    ApplicationPermissionPreset.current.managementRoles();

  public static readonly CAN_VIEW_TAB_AI_ASSISTANT: Set<UserRoleType> =
    ApplicationPermissionPreset.current.managementRoles();
  public static readonly CAN_VIEW_TAB_ANALYTICS: Set<UserRoleType> =
    ApplicationPermissionPreset.current.managementRoles();

  // Granular Action Permissions (Read vs Write)
  public static readonly CAN_WRITE_CORE_ASSETS: Set<UserRoleType> =
    ApplicationPermissionPreset.current.operatorRolePreset();
  public static readonly CAN_WRITE_CORE_LICENSES: Set<UserRoleType> =
    ApplicationPermissionPreset.current.operatorRolePreset();
  public static readonly CAN_WRITE_CORE_CLOUD: Set<UserRoleType> =
    ApplicationPermissionPreset.current.managementRoles();

  public static readonly CAN_WRITE_ORGANIZATION: Set<UserRoleType> =
    ApplicationPermissionPreset.current.operatorRolePreset();
  public static readonly CAN_WRITE_OPERATIONS: Set<UserRoleType> =
    ApplicationPermissionPreset.current.managementRoles();
  public static readonly CAN_WRITE_INTELLIGENCE: Set<UserRoleType> =
    ApplicationPermissionPreset.current.managementRoles();

  // Special System Modules
  public static readonly CAN_ACCESS_SETTINGS: Set<UserRoleType> =
    ApplicationPermissionPreset.current.managementRoles();
  public static readonly CAN_ACCESS_DEV_DASHBOARD: Set<UserRoleType> =
    ApplicationPermissionPreset.current.developerOnly();
}