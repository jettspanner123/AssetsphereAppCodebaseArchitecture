namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public sealed class PurchaseOrderCreateDTO
{
    public string PoNumber { get; set; } = string.Empty;
    public string VendorName { get; set; } = string.Empty;
    public string VendorId { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public DateTime? ExpectedDeliveryDate { get; set; }
    public decimal TotalAmount { get; set; } = 0.0m;
    public string Currency { get; set; } = "USD";
    public string Status { get; set; } = "Draft";
    public string BudgetCode { get; set; } = "CAPEX-2026";
    public string CostCenter { get; set; } = "IT-INFRA";
    public string RequestedBy { get; set; } = string.Empty;
    public string? LineItemsJson { get; set; }
    public string? Notes { get; set; }
}

public sealed class PurchaseOrderUpdateDTO
{
    public string? VendorName { get; set; }
    public string? VendorId { get; set; }
    public DateTime? ExpectedDeliveryDate { get; set; }
    public decimal? TotalAmount { get; set; }
    public string? Currency { get; set; }
    public string? Status { get; set; }
    public string? BudgetCode { get; set; }
    public string? CostCenter { get; set; }
    public string? LineItemsJson { get; set; }
    public string? Notes { get; set; }
}

public sealed class PurchaseOrderResponseDTO
{
    public Guid Id { get; set; }
    public string PoNumber { get; set; } = string.Empty;
    public string VendorName { get; set; } = string.Empty;
    public string VendorId { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public DateTime? ExpectedDeliveryDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string BudgetCode { get; set; } = string.Empty;
    public string CostCenter { get; set; } = string.Empty;
    public string RequestedBy { get; set; } = string.Empty;
    public string? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? LineItemsJson { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
