namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public sealed class EmployeeCreateDTO
{
    public string EmployeeId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = "Engineering";
    public string Designation { get; set; } = "Software Engineer";
    public string Location { get; set; } = "HQ Bangalore";
    public string Status { get; set; } = "Active";
    public string? ManagerName { get; set; }
    public string? ContactPhone { get; set; }
    public string? AvatarUrl { get; set; }
}

public sealed class EmployeeUpdateDTO
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Department { get; set; }
    public string? Designation { get; set; }
    public string? Location { get; set; }
    public string? Status { get; set; }
    public string? ManagerName { get; set; }
    public string? ContactPhone { get; set; }
    public string? AvatarUrl { get; set; }
}

public sealed class EmployeeResponseDTO
{
    public Guid Id { get; set; }
    public string EmployeeId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? ManagerName { get; set; }
    public string? ContactPhone { get; set; }
    public string? AvatarUrl { get; set; }
    public int AllocatedAssetCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
