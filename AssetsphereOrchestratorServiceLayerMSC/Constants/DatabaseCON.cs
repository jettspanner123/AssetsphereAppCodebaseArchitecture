namespace AssetsphereOrchestratorServiceLayerMSC.Constants;

public static class DatabaseCON
{
    public const string DefaultSchema = "public";
    public const string ConnectionStringKey = "ASSETSPHERE_DATABASE_CONNECTION_STRING";

    // Table Names - Strict Convention: AS_${PascalCase}TBL
    public const string UsersTable = "AS_UsersTBL";
    public const string AssetsTable = "AS_AssetsTBL";
    public const string EmployeesTable = "AS_EmployeesTBL";
    public const string SoftwareLicensesTable = "AS_SoftwareLicensesTBL";
    public const string CloudResourcesTable = "AS_CloudResourcesTBL";
    public const string PurchaseOrdersTable = "AS_PurchaseOrdersTBL";
    public const string VendorProfilesTable = "AS_VendorProfilesTBL";
    public const string ServiceTicketsTable = "AS_ServiceTicketsTBL";
    public const string VerificationCampaignsTable = "AS_VerificationCampaignsTBL";
    public const string ComplianceFrameworksTable = "AS_ComplianceFrameworksTBL";
    public const string AIRecommendationsTable = "AS_AIRecommendationsTBL";
    public const string AuditLogsTable = "AS_AuditLogsTBL";
    public const string ConfigurationConstantsTable = "AS_ConfigurationConstantTBL";
    public const string NotificationsTable = "AS_NotificationTBL";
    public const string DeviceServiceRequestsTable = "AS_DeviceServiceRequestsTBL";
}
