using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.Configuration.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Configuration;

[ApiController]
[Route("Api/V1/ConfigurationConstant")]
[Authorize(Roles = "OPERATOR,ADMIN,DEVELOPER")]
public sealed class ConfigurationConstantController : ControllerBase
{
    private readonly ConfigurationConstantService _configurationService;

    public ConfigurationConstantController(ConfigurationConstantService configurationService)
    {
        _configurationService = configurationService;
    }

    [HttpGet("")]
    public async Task<ActionResult<ApiResponseClass<List<ConfigurationConstantResponseDTO>>>> GetAll()
    {
        List<ConfigurationConstantResponseDTO> constants = await _configurationService.GetAllConstantsAsync();
        return Ok(ApiResponseClass<List<ConfigurationConstantResponseDTO>>.Succeeded(constants));
    }

    [HttpGet("{key}")]
    public async Task<ActionResult<ApiResponseClass<ConfigurationConstantResponseDTO>>> GetByKey([FromRoute] string key)
    {
        ConfigurationConstantResponseDTO? constant = await _configurationService.GetConstantByKeyAsync(key);
        if (constant == null)
        {
            return NotFound(ApiResponseClass<ConfigurationConstantResponseDTO>.Failed($"Configuration constant with key '{key}' not found.", null, 404));
        }

        return Ok(ApiResponseClass<ConfigurationConstantResponseDTO>.Succeeded(constant));
    }
}
