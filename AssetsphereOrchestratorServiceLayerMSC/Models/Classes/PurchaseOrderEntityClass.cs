namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class PurchaseOrderEntityClass : BaseEntityClass
{
    public string PoNumber { get; set; } = string.Empty; // e.g. PO-2026-089
    public string VendorName { get; set; } = string.Empty;
    public string VendorId { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public DateTime? ExpectedDeliveryDate { get; set; }
    public decimal TotalAmount { get; set; } = 0.0m;
    public string Currency { get; set; } = "USD";
    public string Status { get; set; } = "Draft"; // Draft, Submitted, Approved, Fulfilled, Cancelled
    public string BudgetCode { get; set; } = "CAPEX-2026";
    public string CostCenter { get; set; } = "IT-INFRA";
    public string RequestedBy { get; set; } = string.Empty;
    public string? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? LineItemsJson { get; set; }
    public string? Notes { get; set; }
}
