namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class ConfigurationConstantEntityClass : BaseEntityClass
{
    public string ConfigurationKey { get; set; } = string.Empty;
    public string ConfigurationValue { get; set; } = string.Empty;
    public string? Notes { get; set; }
}
