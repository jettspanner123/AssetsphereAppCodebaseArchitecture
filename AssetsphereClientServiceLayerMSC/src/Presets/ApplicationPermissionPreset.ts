import { UserRoleType } from '@/src/Types';

export default class ApplicationPermissionPreset {
  public static current: ApplicationPermissionPreset = new ApplicationPermissionPreset();

  public allRoles(): Set<UserRoleType> {
    return new Set([
      UserRoleType.ADMIN,
      UserRoleType.OPERATOR,
      UserRoleType.DEVELOPER,
      UserRoleType.USER,
    ]);
  }

  public baseRolePreset(): Set<UserRoleType> {
    return this.managementRoles();
  }

  public managementRoles(): Set<UserRoleType> {
    return new Set([UserRoleType.ADMIN, UserRoleType.DEVELOPER]);
  }

  public operatorRolePreset(): Set<UserRoleType> {
    return new Set([
      UserRoleType.ADMIN,
      UserRoleType.DEVELOPER,
      UserRoleType.OPERATOR,
    ]);
  }

  public developerOnly(): Set<UserRoleType> {
    return new Set([UserRoleType.DEVELOPER]);
  }

  public adminOnly(): Set<UserRoleType> {
    return new Set([UserRoleType.ADMIN]);
  }
}