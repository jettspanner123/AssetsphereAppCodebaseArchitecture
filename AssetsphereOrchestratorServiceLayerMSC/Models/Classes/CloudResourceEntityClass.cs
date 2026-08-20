namespace AssetsphereOrchestratorServiceLayerMSC.Models.Classes;

public sealed class CloudResourceEntityClass : BaseEntityClass
{
    public string ResourceName { get; set; } = string.Empty;
    public string Provider { get; set; } = "AWS"; // AWS, Azure, GCP
    public string ServiceType { get; set; } = "EC2"; // EC2, S3, RDS, EKS, Azure VM, Cloud SQL
    public string Region { get; set; } = "us-east-1";
    public string Status { get; set; } = "Running"; // Running, Stopped, Terminated
    public decimal MonthlyCost { get; set; } = 0.0m;
    public string Environment { get; set; } = "Production"; // Production, Staging, Development
    public string? TagsJson { get; set; }
    public string? OwnerEmail { get; set; }
    public string? ConfigurationSpecsJson { get; set; }
}
