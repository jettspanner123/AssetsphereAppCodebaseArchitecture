namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public sealed class CloudResourceCreateDTO
{
    public string ResourceName { get; set; } = string.Empty;
    public string Provider { get; set; } = "AWS";
    public string ServiceType { get; set; } = "EC2";
    public string Region { get; set; } = "us-east-1";
    public string Status { get; set; } = "Running";
    public decimal MonthlyCost { get; set; } = 0.0m;
    public string Environment { get; set; } = "Production";
    public string? TagsJson { get; set; }
    public string? OwnerEmail { get; set; }
    public string? ConfigurationSpecsJson { get; set; }
}

public sealed class CloudResourceUpdateDTO
{
    public string? ResourceName { get; set; }
    public string? Provider { get; set; }
    public string? ServiceType { get; set; }
    public string? Region { get; set; }
    public string? Status { get; set; }
    public decimal? MonthlyCost { get; set; }
    public string? Environment { get; set; }
    public string? TagsJson { get; set; }
    public string? OwnerEmail { get; set; }
    public string? ConfigurationSpecsJson { get; set; }
}

public sealed class CloudResourceResponseDTO
{
    public Guid Id { get; set; }
    public string ResourceName { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty;
    public string ServiceType { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal MonthlyCost { get; set; }
    public string Environment { get; set; } = string.Empty;
    public string? TagsJson { get; set; }
    public string? OwnerEmail { get; set; }
    public string? ConfigurationSpecsJson { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
