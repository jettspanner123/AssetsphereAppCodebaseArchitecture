namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class VendorProfileEntityClass : BaseEntityClass
{
    public string VendorName { get; set; } = string.Empty;
    public string Category { get; set; } = "Hardware Supplier";
    public string ContactPerson { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string GstNumber { get; set; } = string.Empty;
    public string Status { get; set; } = "Active"; // Active, Preferred, Under Review, Inactive
    public decimal Rating { get; set; } = 4.5m; // 1.0 - 5.0
    public string? SlaDetails { get; set; }
    public int ResponseTimeHours { get; set; } = 4;
    public string? ContractTerms { get; set; }
}
