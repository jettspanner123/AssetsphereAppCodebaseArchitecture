namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public sealed class VendorCreateDTO
{
    public string VendorName { get; set; } = string.Empty;
    public string Category { get; set; } = "Hardware Supplier";
    public string ContactPerson { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string GstNumber { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public decimal Rating { get; set; } = 4.5m;
    public string? SlaDetails { get; set; }
    public int ResponseTimeHours { get; set; } = 4;
    public string? ContractTerms { get; set; }
}

public sealed class VendorUpdateDTO
{
    public string? VendorName { get; set; }
    public string? Category { get; set; }
    public string? ContactPerson { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? GstNumber { get; set; }
    public string? Status { get; set; }
    public decimal? Rating { get; set; }
    public string? SlaDetails { get; set; }
    public int? ResponseTimeHours { get; set; }
    public string? ContractTerms { get; set; }
}

public sealed class VendorResponseDTO
{
    public Guid Id { get; set; }
    public string VendorName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string GstNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Rating { get; set; }
    public string? SlaDetails { get; set; }
    public int ResponseTimeHours { get; set; }
    public string? ContractTerms { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
