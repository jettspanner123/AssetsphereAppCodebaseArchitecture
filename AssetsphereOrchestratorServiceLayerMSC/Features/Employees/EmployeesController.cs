using System.Security.Claims;
using AssetsphereOrchestratorServiceLayerMSC.Factories;
using AssetsphereOrchestratorServiceLayerMSC.Features.Employees.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using AssetsphereOrchestratorServiceLayerMSC.Models.Types;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.Employees;

[ApiController]
[Route(ApplicationRouteFactory.EmployeeRoutes.ControllerURL)]
[Authorize]
public sealed class EmployeesController : ControllerBase
{
    private readonly EmployeesService _employeesService;

    public EmployeesController(EmployeesService employeesService)
    {
        _employeesService = employeesService;
    }

    [HttpGet(ApplicationRouteFactory.EmployeeRoutes.GetAll)]
    public async Task<ActionResult<ApiResponseClass<List<EmployeeResponseDTO>>>> GetAll(
        [FromQuery] DepartmentType? department,
        [FromQuery] string? search)
    {
        List<EmployeeResponseDTO> employees = await _employeesService.GetAllEmployeesAsync(department, search);
        return Ok(ApiResponseClass<List<EmployeeResponseDTO>>.Succeeded(employees));
    }

    [HttpGet(ApplicationRouteFactory.EmployeeRoutes.GetById)]
    public async Task<ActionResult<ApiResponseClass<EmployeeResponseDTO>>> GetById([FromRoute] Guid id)
    {
        EmployeeResponseDTO emp = await _employeesService.GetEmployeeByIdAsync(id);
        return Ok(ApiResponseClass<EmployeeResponseDTO>.Succeeded(emp));
    }

    [HttpGet(ApplicationRouteFactory.EmployeeRoutes.AssignedAssets)]
    public async Task<ActionResult<ApiResponseClass<List<AssetResponseDTO>>>> GetAssignedAssets([FromRoute] string id)
    {
        List<AssetResponseDTO> assets = await _employeesService.GetAssignedAssetsAsync(id);
        return Ok(ApiResponseClass<List<AssetResponseDTO>>.Succeeded(assets));
    }

    [HttpPost(ApplicationRouteFactory.EmployeeRoutes.Create)]
    public async Task<ActionResult<ApiResponseClass<EmployeeResponseDTO>>> Create([FromBody] EmployeeCreateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        EmployeeResponseDTO emp = await _employeesService.CreateEmployeeAsync(request, username);
        return CreatedAtAction(nameof(GetById), new { id = emp.Id }, ApiResponseClass<EmployeeResponseDTO>.Succeeded(emp, "Employee created successfully.", 201));
    }

    [HttpPut(ApplicationRouteFactory.EmployeeRoutes.Update)]
    public async Task<ActionResult<ApiResponseClass<EmployeeResponseDTO>>> Update([FromRoute] Guid id, [FromBody] EmployeeUpdateDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        EmployeeResponseDTO emp = await _employeesService.UpdateEmployeeAsync(id, request, username);
        return Ok(ApiResponseClass<EmployeeResponseDTO>.Succeeded(emp, "Employee updated successfully."));
    }

    [HttpDelete(ApplicationRouteFactory.EmployeeRoutes.Delete)]
    public async Task<ActionResult<ApiResponseClass<bool>>> Delete([FromRoute] Guid id)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        await _employeesService.DeleteEmployeeAsync(id, username);
        return Ok(ApiResponseClass<bool>.Succeeded(true, "Employee removed successfully."));
    }
}
