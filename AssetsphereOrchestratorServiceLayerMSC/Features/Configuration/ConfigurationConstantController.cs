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

    [HttpPost("AddDesignation")]
    public async Task<ActionResult<ApiResponseClass<ConfigurationConstantResponseDTO>>> AddDesignation([FromBody] AddDesignationRequestDTO request)
    {
        if (string.IsNullOrWhiteSpace(request.Department) || string.IsNullOrWhiteSpace(request.Designation))
        {
            return BadRequest(ApiResponseClass<ConfigurationConstantResponseDTO>.Failed("Department and Designation are required.", null, 400));
        }

        ConfigurationConstantResponseDTO result = await _configurationService.AddDesignationAsync(request.Department, request.Designation);
        return Ok(ApiResponseClass<ConfigurationConstantResponseDTO>.Succeeded(result, "Designation added successfully."));
    }

    [HttpPost("AddDepartment")]
    public async Task<ActionResult<ApiResponseClass<ConfigurationConstantResponseDTO>>> AddDepartment([FromBody] AddDepartmentRequestDTO request)
    {
        if (string.IsNullOrWhiteSpace(request.Department))
        {
            return BadRequest(ApiResponseClass<ConfigurationConstantResponseDTO>.Failed("Department name is required.", null, 400));
        }

        ConfigurationConstantResponseDTO result = await _configurationService.AddDepartmentAsync(request.Department);
        return Ok(ApiResponseClass<ConfigurationConstantResponseDTO>.Succeeded(result, "Department added successfully."));
    }

    [HttpPost("AddWorkLocation")]
    public async Task<ActionResult<ApiResponseClass<ConfigurationConstantResponseDTO>>> AddWorkLocation([FromBody] AddWorkLocationRequestDTO request)
    {
        if (string.IsNullOrWhiteSpace(request.Location))
        {
            return BadRequest(ApiResponseClass<ConfigurationConstantResponseDTO>.Failed("Location name is required.", null, 400));
        }

        ConfigurationConstantResponseDTO result = await _configurationService.AddWorkLocationAsync(request.Location);
        return Ok(ApiResponseClass<ConfigurationConstantResponseDTO>.Succeeded(result, "Work location added successfully."));
    }

    [HttpPost("DeleteWorkLocation")]
    public async Task<ActionResult<ApiResponseClass<ConfigurationConstantResponseDTO>>> DeleteWorkLocation([FromBody] DeleteWorkLocationRequestDTO request)
    {
        if (string.IsNullOrWhiteSpace(request.Location))
        {
            return BadRequest(ApiResponseClass<ConfigurationConstantResponseDTO>.Failed("Location name is required.", null, 400));
        }

        var (succeeded, errorMessage, result) = await _configurationService.DeleteWorkLocationAsync(request.Location);
        if (!succeeded)
        {
            return BadRequest(ApiResponseClass<ConfigurationConstantResponseDTO>.Failed(errorMessage ?? "Failed to delete work location.", null, 400));
        }

        return Ok(ApiResponseClass<ConfigurationConstantResponseDTO>.Succeeded(result!, "Work location deleted successfully."));
    }
}
