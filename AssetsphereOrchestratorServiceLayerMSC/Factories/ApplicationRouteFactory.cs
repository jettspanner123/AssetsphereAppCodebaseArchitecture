namespace AssetsphereOrchestratorServiceLayerMSC.Factories;

public sealed class ApplicationRouteFactory
{
    private static readonly ApplicationRouteFactory _current = new ApplicationRouteFactory();
    public static ApplicationRouteFactory Current => _current;

    private ApplicationRouteFactory()
    {
    }

    public AuthenticationRoutes Authentication { get; } = new();
    public AssetInventoryRoutes AssetInventory { get; } = new();
    public EmployeeRoutes Employees { get; } = new();
    public SoftwareLicenseRoutes SoftwareLicenses { get; } = new();
    public CloudInfrastructureRoutes CloudInfrastructure { get; } = new();
    public ProcurementRoutes Procurement { get; } = new();
    public VendorRoutes Vendors { get; } = new();
    public ServiceDeskRoutes ServiceDesk { get; } = new();
    public ComplianceRoutes Compliance { get; } = new();
    public VerificationCampaignRoutes VerificationCampaign { get; } = new();
    public AIAssistantRoutes AIAssistant { get; } = new();
    public DashboardRoutes Dashboard { get; } = new();
    public ConfigurationConstantRoutes ConfigurationConstant { get; } = new();

    public sealed class AuthenticationRoutes
    {
        public const string ControllerURL = "Api/V1/Authentication";
        public const string Login = "Login";
        public const string Register = "Register";
        public const string Me = "Me";
        public const string RefreshToken = "RefreshToken";
        public const string PendingUsers = "PendingUsers";
        public const string ApproveUser = "ApproveUser/{id}";
        public const string RejectUser = "RejectUser/{id}";
    }

    public sealed class AssetInventoryRoutes
    {
        public const string ControllerURL = "Api/V1/AssetInventory";
        public const string GetAll = "";
        public const string GetById = "{id}";
        public const string Create = "";
        public const string Update = "{id}";
        public const string Delete = "{id}";
        public const string QuickSearch = "QuickSearch";
        public const string ByCategory = "Category/{category}";
        public const string UpdateLifecycle = "{id}/Lifecycle";
        public const string AssignEmployee = "{id}/Assign";
        public const string BulkAction = "Bulk";
        public const string QrLookup = "Qr/{qrAssetId}";
    }

    public sealed class EmployeeRoutes
    {
        public const string ControllerURL = "Api/V1/Employees";
        public const string GetAll = "";
        public const string GetById = "{id}";
        public const string Create = "";
        public const string Update = "{id}";
        public const string Delete = "{id}";
        public const string AssignedAssets = "{id}/Assets";
    }

    public sealed class SoftwareLicenseRoutes
    {
        public const string ControllerURL = "Api/V1/SoftwareLicenses";
        public const string GetAll = "";
        public const string GetById = "{id}";
        public const string Create = "";
        public const string Update = "{id}";
        public const string Delete = "{id}";
        public const string ComplianceSummary = "ComplianceSummary";
    }

    public sealed class CloudInfrastructureRoutes
    {
        public const string ControllerURL = "Api/V1/CloudInfrastructure";
        public const string GetAll = "";
        public const string GetById = "{id}";
        public const string Create = "";
        public const string Update = "{id}";
        public const string Delete = "{id}";
        public const string CostRollup = "CostRollup";
    }

    public sealed class ProcurementRoutes
    {
        public const string ControllerURL = "Api/V1/Procurement";
        public const string GetAll = "";
        public const string GetById = "{id}";
        public const string Create = "";
        public const string Update = "{id}";
        public const string Delete = "{id}";
        public const string Approve = "{id}/Approve";
    }

    public sealed class VendorRoutes
    {
        public const string ControllerURL = "Api/V1/Vendors";
        public const string GetAll = "";
        public const string GetById = "{id}";
        public const string Create = "";
        public const string Update = "{id}";
        public const string Delete = "{id}";
    }

    public sealed class ServiceDeskRoutes
    {
        public const string ControllerURL = "Api/V1/ServiceDesk";
        public const string GetAll = "";
        public const string GetById = "{id}";
        public const string Create = "";
        public const string Update = "{id}";
        public const string Delete = "{id}";
        public const string Resolve = "{id}/Resolve";
    }

    public sealed class ComplianceRoutes
    {
        public const string ControllerURL = "Api/V1/Compliance";
        public const string GetAll = "";
        public const string GetById = "{id}";
        public const string Create = "";
        public const string Update = "{id}";
        public const string BaselineScore = "BaselineScore";
    }

    public sealed class VerificationCampaignRoutes
    {
        public const string ControllerURL = "Api/V1/VerificationCampaign";
        public const string GetAll = "";
        public const string GetById = "{id}";
        public const string Create = "";
        public const string Update = "{id}";
        public const string VerifyScan = "{id}/VerifyScan";
    }

    public sealed class AIAssistantRoutes
    {
        public const string ControllerURL = "Api/V1/AIAssistant";
        public const string GetRecommendations = "Recommendations";
        public const string Query = "Query";
        public const string DismissRecommendation = "Recommendations/{id}/Dismiss";
    }

    public sealed class DashboardRoutes
    {
        public const string ControllerURL = "Api/V1/Dashboard";
        public const string Summary = "Summary";
        public const string Analytics = "Analytics";
    }

    public sealed class ConfigurationConstantRoutes
    {
        public const string ControllerURL = "Api/V1/ConfigurationConstant";
        public const string GetAll = "";
        public const string GetByKey = "{key}";
    }
}
