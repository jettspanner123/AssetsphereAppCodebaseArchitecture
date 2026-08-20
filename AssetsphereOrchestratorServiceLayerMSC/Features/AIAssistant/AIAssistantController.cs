using System.Security.Claims;
using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.AIAssistant.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.AIAssistant;

[ApiController]
[Route(ApplicationRouteFactory.AIAssistantRoutes.ControllerURL)]
[Authorize]
public sealed class AIAssistantController : ControllerBase
{
    private readonly AIAssistantService _aiService;

    public AIAssistantController(AIAssistantService aiService)
    {
        _aiService = aiService;
    }

    [HttpGet(ApplicationRouteFactory.AIAssistantRoutes.GetRecommendations)]
    public async Task<ActionResult<ApiResponseClass<List<AIRecommendationResponseDTO>>>> GetRecommendations()
    {
        List<AIRecommendationResponseDTO> list = await _aiService.GetRecommendationsAsync();
        return Ok(ApiResponseClass<List<AIRecommendationResponseDTO>>.Succeeded(list));
    }

    [HttpPost(ApplicationRouteFactory.AIAssistantRoutes.Query)]
    public async Task<ActionResult<ApiResponseClass<AIQueryResponseDTO>>> QueryCopilot([FromBody] AIQueryRequestDTO request)
    {
        AIQueryResponseDTO response = await _aiService.QueryCopilotAsync(request);
        return Ok(ApiResponseClass<AIQueryResponseDTO>.Succeeded(response));
    }

    [HttpPatch(ApplicationRouteFactory.AIAssistantRoutes.DismissRecommendation)]
    public async Task<ActionResult<ApiResponseClass<bool>>> DismissRecommendation([FromRoute] Guid id)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        await _aiService.DismissRecommendationAsync(id, username);
        return Ok(ApiResponseClass<bool>.Succeeded(true, "Recommendation dismissed."));
    }
}
