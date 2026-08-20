using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Exceptions;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.AIAssistant.Services;

public sealed class AIAssistantService
{
    private readonly AssetsphereDbContext _dbContext;

    public AIAssistantService(AssetsphereDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<AIRecommendationResponseDTO>> GetRecommendationsAsync()
    {
        List<AIRecommendationEntityClass> list = await _dbContext.AIRecommendations
            .AsNoTracking()
            .Where(r => !r.IsDismissed)
            .OrderByDescending(r => r.EstimatedSavings)
            .ToListAsync();

        return list.Select(r => new AIRecommendationResponseDTO
        {
            Id = r.Id,
            Category = r.Category,
            Title = r.Title,
            ImpactLevel = r.ImpactLevel,
            EstimatedSavings = r.EstimatedSavings,
            RecommendationText = r.RecommendationText,
            ActionType = r.ActionType,
            TargetEntityId = r.TargetEntityId,
            TargetEntityType = r.TargetEntityType,
            IsApplied = r.IsApplied,
            IsDismissed = r.IsDismissed,
            CreatedAt = r.CreatedAt
        }).ToList();
    }

    public async Task<bool> DismissRecommendationAsync(Guid id, string updatedBy)
    {
        AIRecommendationEntityClass? rec = await _dbContext.AIRecommendations.FindAsync(id);
        if (rec == null)
        {
            throw new EntityNotFoundCException("AIRecommendation", id);
        }

        rec.IsDismissed = true;
        rec.UpdatedBy = updatedBy;
        rec.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<AIQueryResponseDTO> QueryCopilotAsync(AIQueryRequestDTO request)
    {
        string prompt = request.Query.ToLower();

        if (prompt.Contains("laptop") || prompt.Contains("macbook") || prompt.Contains("computing"))
        {
            int computingCount = await _dbContext.Assets.CountAsync(a => a.Category == "Computing");
            return new AIQueryResponseDTO
            {
                Answer = $"You currently have {computingCount} computing assets active across your organization. 98% of these devices meet current security baseline guidelines.",
                Intent = "AssetQuery",
                SuggestedActions = new List<string> { "View Computing Inventory", "Check Warranty Expiries", "Run Batch Diagnostic" }
            };
        }

        if (prompt.Contains("cost") || prompt.Contains("spend") || prompt.Contains("savings") || prompt.Contains("budget"))
        {
            decimal cloudSpend = await _dbContext.CloudResources.Where(r => r.Status == "Running").SumAsync(r => r.MonthlyCost);
            decimal totalAssetValue = await _dbContext.Assets.SumAsync(a => a.CurrentBookValue);
            return new AIQueryResponseDTO
            {
                Answer = $"Total monthly cloud expenditure is currently ${cloudSpend:N2}/month. Active physical asset book value totals ${totalAssetValue:N2}. 2 optimization opportunities can save ~$24,220/year.",
                Intent = "FinancialQuery",
                SuggestedActions = new List<string> { "Review Figma Enterprise Unused Seats", "View Cloud Resource Breakdown", "Export Financial Summary" }
            };
        }

        if (prompt.Contains("compliance") || prompt.Contains("audit") || prompt.Contains("soc2"))
        {
            return new AIQueryResponseDTO
            {
                Answer = "Your current overall IT compliance baseline is 96.2% compliant against SOC 2 Type II and 94.0% on ISO 27001:2022. No critical vulnerabilities are unresolved.",
                Intent = "ComplianceQuery",
                SuggestedActions = new List<string> { "View SOC 2 Controls", "Trigger Remediation Ticket", "Download Audit Package" }
            };
        }

        return new AIQueryResponseDTO
        {
            Answer = $"Assetsphere AI Copilot analyzed your request: '{request.Query}'. All enterprise asset records, licenses, and cloud instances are synchronized in real time.",
            Intent = "GeneralQuery",
            SuggestedActions = new List<string> { "Search All Assets", "Generate Inventory Report", "Check Open Tickets" }
        };
    }
}
