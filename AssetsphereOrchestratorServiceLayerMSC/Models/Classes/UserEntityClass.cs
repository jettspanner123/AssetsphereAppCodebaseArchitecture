using AssetsphereOrchestratorServiceLayerMSC.Models.Types;

namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class UserEntityClass : BaseEntityClass
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public UserRoleType Role { get; set; } = UserRoleType.ADMIN;
    public DepartmentType? Department { get; set; }
    public string? AvatarUrl { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsVerified { get; set; } = false;
    public DateTime? LastLoginAt { get; set; }
}
