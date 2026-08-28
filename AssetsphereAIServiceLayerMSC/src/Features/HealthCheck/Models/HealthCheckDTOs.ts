import { ApiProperty } from '@nestjs/swagger';

export class HealthStatusType {
  public static readonly Healthy: string = 'Healthy';
  public static readonly Degraded: string = 'Degraded';
  public static readonly Unhealthy: string = 'Unhealthy';
}

export class ComponentHealthDTO {
  @ApiProperty({ description: 'Name of the diagnostic component / subsystem', example: 'GeminiAiInferenceEngine', type: String })
  public ComponentName: string;

  @ApiProperty({ description: 'Current health state of the component', example: 'Healthy', type: String })
  public Status: string;

  @ApiProperty({ description: 'Latency / execution response time in milliseconds', example: 4, type: Number })
  public LatencyMs: number;

  @ApiProperty({ description: 'Component operational details', example: 'Gemini 2.5 Flash ready for inference.', required: false, type: String })
  public Details?: string | null;

  @ApiProperty({ description: 'UTC timestamp of component diagnostic check', example: '2026-08-28T12:00:00.000Z', type: String })
  public CheckedAt: string;

  public constructor(
    componentName: string,
    status: string,
    latencyMs: number,
    details?: string | null,
    checkedAt?: string
  ) {
    this.ComponentName = componentName;
    this.Status = status;
    this.LatencyMs = latencyMs;
    this.Details = details ?? null;
    this.CheckedAt = checkedAt ?? new Date().toISOString();
  }
}

export class RuntimeHealthDTO {
  @ApiProperty({ description: 'Runtime environment profile name', example: 'Development', type: String })
  public EnvironmentName: string;

  @ApiProperty({ description: 'Formatted application uptime', example: '0d 0h 5m 12s', type: String })
  public Uptime: string;

  @ApiProperty({ description: 'Process memory allocated in Megabytes', example: 142.5, type: Number })
  public MemoryAllocatedMB: number;

  @ApiProperty({ description: 'Active worker/logical CPU thread count', example: 14, type: Number })
  public ThreadCount: number;

  @ApiProperty({ description: 'Runtime platform engine version', example: 'Node.js v22.14.0 (win32-x64)', type: String })
  public RuntimeVersion: string;

  public constructor(
    environmentName: string,
    uptime: string,
    memoryAllocatedMB: number,
    threadCount: number,
    runtimeVersion: string
  ) {
    this.EnvironmentName = environmentName;
    this.Uptime = uptime;
    this.MemoryAllocatedMB = memoryAllocatedMB;
    this.ThreadCount = threadCount;
    this.RuntimeVersion = runtimeVersion;
  }
}

export class HealthCheckResponseDTO {
  @ApiProperty({ description: 'Overall system health status', example: 'Healthy', type: String })
  public OverallStatus: string;

  @ApiProperty({ description: 'Total execution diagnostic duration in milliseconds', example: 12, type: Number })
  public TotalDurationMs: number;

  @ApiProperty({ type: () => RuntimeHealthDTO, description: 'Application runtime diagnostic metadata' })
  public Runtime: RuntimeHealthDTO;

  @ApiProperty({ type: () => [ComponentHealthDTO], description: 'Detailed individual subsystem health breakdowns' })
  public Subsystems: ComponentHealthDTO[];

  @ApiProperty({ description: 'Diagnostics timestamp in UTC ISO format', example: '2026-08-28T12:00:00.000Z', type: String })
  public Timestamp: string;

  public constructor(
    overallStatus: string,
    totalDurationMs: number,
    runtime: RuntimeHealthDTO,
    subsystems: ComponentHealthDTO[],
    timestamp?: string
  ) {
    this.OverallStatus = overallStatus;
    this.TotalDurationMs = totalDurationMs;
    this.Runtime = runtime;
    this.Subsystems = subsystems;
    this.Timestamp = timestamp ?? new Date().toISOString();
  }
}
