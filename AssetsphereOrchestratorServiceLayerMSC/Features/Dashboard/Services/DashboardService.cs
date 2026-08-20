using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Dashboard.Services;

public sealed class DashboardService
{
    private readonly AssetsphereDbContext _dbContext;

    public DashboardService(AssetsphereDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DashboardSummaryDTO> GetSummaryAsync()
    {
        int totalAssets = await _dbContext.Assets.CountAsync();
        int assignedAssets = await _dbContext.Assets.CountAsync(a => a.Status == "Assigned" || a.Status == "In Use");
        int availableAssets = await _dbContext.Assets.CountAsync(a => a.Status == "Inventory" || a.Status == "Received");
        int inRepairAssets = await _dbContext.Assets.CountAsync(a => a.Status == "Repair" || a.Status == "Maintenance");
        int totalEmployees = await _dbContext.Employees.CountAsync();
        int openTickets = await _dbContext.ServiceTickets.CountAsync(t => t.Status != "Resolved" && t.Status != "Closed");
        int activeCampaigns = await _dbContext.VerificationCampaigns.CountAsync(c => c.Status == "Active");
        decimal totalBookValue = await _dbContext.Assets.SumAsync(a => a.CurrentBookValue);
        decimal monthlyCloudSpend = await _dbContext.CloudResources.Where(r => r.Status == "Running").SumAsync(r => r.MonthlyCost);
        int activeRecs = await _dbContext.AIRecommendations.CountAsync(r => !r.IsDismissed);

        return new DashboardSummaryDTO
        {
            TotalAssets = totalAssets,
            AssignedAssets = assignedAssets,
            AvailableAssets = availableAssets,
            InRepairAssets = inRepairAssets,
            TotalEmployees = totalEmployees,
            OpenTickets = openTickets,
            ActiveVerificationCampaigns = activeCampaigns,
            TotalAssetBookValue = totalBookValue,
            TotalMonthlyCloudSpend = monthlyCloudSpend,
            ComplianceScoreAvg = 95.8m,
            ExpiringWarrantiesCount = 3,
            ActiveRecommendationsCount = activeRecs
        };
    }

    public async Task<DashboardAnalyticsDTO> GetAnalyticsAsync()
    {
        DashboardSummaryDTO summary = await GetSummaryAsync();

        // Category breakdown
        var categoryGroups = await _dbContext.Assets
            .GroupBy(a => a.Category)
            .Select(g => new
            {
                Category = g.Key,
                Count = g.Count(),
                TotalValue = g.Sum(a => a.CurrentBookValue)
            })
            .ToListAsync();

        List<DashboardCategoryBreakdownDTO> categoryBreakdowns = categoryGroups.Select(cg => new DashboardCategoryBreakdownDTO
        {
            Category = cg.Category,
            Count = cg.Count,
            TotalValue = cg.TotalValue
        }).ToList();

        // Monthly trends
        List<DashboardMonthlyTrendDTO> monthlyTrends = new List<DashboardMonthlyTrendDTO>
        {
            new DashboardMonthlyTrendDTO { Month = "Mar 2026", ProcurementCost = 45000, MaintenanceCost = 3200, AssetsAdded = 14 },
            new DashboardMonthlyTrendDTO { Month = "Apr 2026", ProcurementCost = 68000, MaintenanceCost = 2800, AssetsAdded = 22 },
            new DashboardMonthlyTrendDTO { Month = "May 2026", ProcurementCost = 32000, MaintenanceCost = 4100, AssetsAdded = 11 },
            new DashboardMonthlyTrendDTO { Month = "Jun 2026", ProcurementCost = 54000, MaintenanceCost = 1900, AssetsAdded = 18 },
            new DashboardMonthlyTrendDTO { Month = "Jul 2026", ProcurementCost = 71000, MaintenanceCost = 3600, AssetsAdded = 25 },
            new DashboardMonthlyTrendDTO { Month = "Aug 2026", ProcurementCost = 82000, MaintenanceCost = 2100, AssetsAdded = 29 }
        };

        // Recent assets
        List<AssetEntityClass> recentEntities = await _dbContext.Assets
            .AsNoTracking()
            .OrderByDescending(a => a.CreatedAt)
            .Take(5)
            .ToListAsync();

        List<AssetResponseDTO> recentAssets = recentEntities.Select(a => new AssetResponseDTO
        {
            Id = a.Id,
            AssetTag = a.AssetTag,
            SerialNumber = a.SerialNumber,
            Category = a.Category,
            Subtype = a.Subtype,
            ModelName = a.ModelName,
            Manufacturer = a.Manufacturer,
            Status = a.Status,
            AssignedEmployeeName = a.AssignedEmployeeName,
            Location = a.Location,
            PurchasePrice = a.PurchasePrice,
            CurrentBookValue = a.CurrentBookValue,
            CreatedAt = a.CreatedAt
        }).ToList();

        return new DashboardAnalyticsDTO
        {
            Summary = summary,
            CategoryBreakdown = categoryBreakdowns,
            MonthlyTrends = monthlyTrends,
            RecentActivityAssets = recentAssets
        };
    }
}
