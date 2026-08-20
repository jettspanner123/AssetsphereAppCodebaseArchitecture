using AssetsphereOrchestratorServiceLayerMSC.Models.Types;

namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class EmployeeEntityClass : BaseEntityClass
{
    public string EmployeeId { get; set; } = string.Empty; // e.g. EMP-1001
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DepartmentType Department { get; set; } = DepartmentType.Engineering;
    public string Designation { get; set; } = "Software Engineer";
    public string Location { get; set; } = "HQ Bangalore";
    public string Status { get; set; } = "Active"; // Active, On Leave, Resigned, Terminated
    public string? ManagerName { get; set; }
    public string? ContactPhone { get; set; }
    public string? AvatarUrl { get; set; }
    public int AllocatedAssetCount { get; set; } = 0;
}
