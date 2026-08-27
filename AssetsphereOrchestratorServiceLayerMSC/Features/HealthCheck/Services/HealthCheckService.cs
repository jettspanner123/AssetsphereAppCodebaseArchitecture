using System.Diagnostics;
using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Features.Authentication.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.AssetInventory.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.Employees.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.Notifications.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.DeviceServiceRequests.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.Configuration.Services;
using AssetsphereOrchestratorServiceLayerMSC.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Features.HealthCheck.Services;

public class HealthCheckService : IHealthCheckService
{
    private static readonly DateTime _serverStartTime = DateTime.UtcNow;
    private readonly AssetsphereDbContext _dbContext;
    private readonly IServiceProvider _serviceProvider;
    private readonly IHostEnvironment _environment;
    private readonly ILogger<HealthCheckService> _logger;

    public HealthCheckService(
        AssetsphereDbContext dbContext,
        IServiceProvider serviceProvider,
        IHostEnvironment environment,
        ILogger<HealthCheckService> logger)
    {
        _dbContext = dbContext;
        _serviceProvider = serviceProvider;
        _environment = environment;
        _logger = logger;
    }

    public async Task<HealthCheckResponseDTO> CheckHealthAsync(CancellationToken cancellationToken = default)
    {
        Stopwatch totalTimer = Stopwatch.StartNew();
        HealthCheckResponseDTO response = new HealthCheckResponseDTO
        {
            Timestamp = DateTime.UtcNow
        };

        // 1. Probe Database Connectivity & Latency
        ComponentHealthDTO dbHealth = new ComponentHealthDTO
        {
            ComponentName = "PostgreSQL Supabase Database",
            CheckedAt = DateTime.UtcNow
        };

        Stopwatch dbTimer = Stopwatch.StartNew();
        try
        {
            bool canConnect = await _dbContext.Database.CanConnectAsync(cancellationToken);
            dbTimer.Stop();
            dbHealth.LatencyMs = dbTimer.ElapsedMilliseconds;

            if (canConnect)
            {
                dbHealth.Status = HealthStatusType.Healthy;
                dbHealth.Details = $"Connected successfully. Latency: {dbTimer.ElapsedMilliseconds}ms";
            }
            else
            {
                dbHealth.Status = HealthStatusType.Unhealthy;
                dbHealth.Details = "Database CanConnectAsync returned false.";
            }
        }
        catch (Exception ex)
        {
            dbTimer.Stop();
            dbHealth.LatencyMs = dbTimer.ElapsedMilliseconds;
            dbHealth.Status = HealthStatusType.Unhealthy;
            dbHealth.Details = $"Database connection exception: {ex.Message}";
            _logger.LogError(ex, "Health check database probe failed.");
        }

        response.Database = dbHealth;

        // 2. Gather Runtime Environment & Uptime
        Process currentProcess = Process.GetCurrentProcess();
        TimeSpan uptimeSpan = DateTime.UtcNow - _serverStartTime;

        response.Runtime = new RuntimeHealthDTO
        {
            EnvironmentName = _environment.EnvironmentName,
            Uptime = $"{uptimeSpan.Days}d {uptimeSpan.Hours}h {uptimeSpan.Minutes}m {uptimeSpan.Seconds}s",
            MemoryAllocatedMB = Math.Round(GC.GetTotalMemory(forceFullCollection: false) / (1024.0 * 1024.0), 2),
            ThreadCount = currentProcess.Threads.Count,
            RuntimeVersion = System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription
        };

        // 3. Probe Subsystems & Dependency Injection Readiness
        List<ComponentHealthDTO> subsystems = new List<ComponentHealthDTO>();

        subsystems.Add(ProbeSubsystemService<AuthenticationService>("Authentication Subsystem"));
        subsystems.Add(ProbeSubsystemService<AssetInventoryService>("Asset Inventory Subsystem"));
        subsystems.Add(ProbeSubsystemService<EmployeesService>("Employees Directory Subsystem"));
        subsystems.Add(ProbeSubsystemService<INotificationsService>("Notifications Subsystem"));
        subsystems.Add(ProbeSubsystemService<IDeviceServiceRequestsService>("Device Service Requests Subsystem"));
        subsystems.Add(ProbeSubsystemService<ConfigurationConstantService>("Configuration Subsystem"));

        response.Subsystems = subsystems;

        // 4. Compute Overall Health Status
        totalTimer.Stop();
        response.TotalDurationMs = totalTimer.ElapsedMilliseconds;

        bool hasUnhealthySubsystem = subsystems.Any(s => s.Status == HealthStatusType.Unhealthy);
        bool hasDegradedSubsystem = subsystems.Any(s => s.Status == HealthStatusType.Degraded);

        if (dbHealth.Status == HealthStatusType.Unhealthy || hasUnhealthySubsystem)
        {
            response.OverallStatus = HealthStatusType.Unhealthy;
        }
        else if (dbHealth.Status == HealthStatusType.Degraded || hasDegradedSubsystem)
        {
            response.OverallStatus = HealthStatusType.Degraded;
        }
        else
        {
            response.OverallStatus = HealthStatusType.Healthy;
        }

        return response;
    }

    private ComponentHealthDTO ProbeSubsystemService<TService>(string subsystemName)
    {
        ComponentHealthDTO comp = new ComponentHealthDTO
        {
            ComponentName = subsystemName,
            CheckedAt = DateTime.UtcNow
        };

        Stopwatch sw = Stopwatch.StartNew();
        try
        {
            using IServiceScope scope = _serviceProvider.CreateScope();
            object? service = scope.ServiceProvider.GetService(typeof(TService));
            sw.Stop();
            comp.LatencyMs = sw.ElapsedMilliseconds;

            if (service != null)
            {
                comp.Status = HealthStatusType.Healthy;
                comp.Details = "Dependency Injection service resolved and operational.";
            }
            else
            {
                comp.Status = HealthStatusType.Unhealthy;
                comp.Details = "Service failed to resolve from DI container.";
            }
        }
        catch (Exception ex)
        {
            sw.Stop();
            comp.LatencyMs = sw.ElapsedMilliseconds;
            comp.Status = HealthStatusType.Unhealthy;
            comp.Details = $"Resolution error: {ex.Message}";
        }

        return comp;
    }
}
