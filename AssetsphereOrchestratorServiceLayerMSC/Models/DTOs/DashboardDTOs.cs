namespace AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;

public sealed class DashboardSummaryDTO
{
    public int TotalAssets { get; set; }
    public int AssignedAssets { get; set; }
    public int AvailableAssets { get; set; }
    public int InRepairAssets { get; set; }
    public int TotalEmployees { get; set; }
    public int OpenTickets { get; set; }
    public int ActiveVerificationCampaigns { get; set; }
    public decimal TotalAssetBookValue { get; set; }
    public decimal TotalMonthlyCloudSpend { get; set; }
    public decimal ComplianceScoreAvg { get; set; }
    public int ExpiringWarrantiesCount { get; set; }
    public int ActiveRecommendationsCount { get; set; }
}

public sealed class DashboardCategoryBreakdownDTO
{
    public string Category { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal TotalValue { get; set; }
}

public sealed class DashboardMonthlyTrendDTO
{
    public string Month { get; set; } = string.Empty;
    public decimal ProcurementCost { get; set; }
    public decimal MaintenanceCost { get; set; }
    public int AssetsAdded { get; set; }
}

public sealed class DashboardAnalyticsDTO
{
    public DashboardSummaryDTO Summary { get; set; } = new();
    public List<DashboardCategoryBreakdownDTO> CategoryBreakdown { get; set; } = new();
    public List<DashboardMonthlyTrendDTO> MonthlyTrends { get; set; } = new();
    public List<AssetResponseDTO> RecentActivityAssets { get; set; } = new();
}
