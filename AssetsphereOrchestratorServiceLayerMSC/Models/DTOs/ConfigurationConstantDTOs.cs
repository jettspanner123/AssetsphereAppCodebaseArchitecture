namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public sealed class ConfigurationConstantResponseDTO
{
    public Guid Id { get; set; }
    public string ConfigurationKey { get; set; } = string.Empty;
    public string ConfigurationValue { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public sealed class ConfigurationConstantUpsertDTO
{
    public string ConfigurationKey { get; set; } = string.Empty;
    public string ConfigurationValue { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public sealed class AddDesignationRequestDTO
{
    public string Department { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
}

public sealed class AddDepartmentRequestDTO
{
    public string Department { get; set; } = string.Empty;
}
