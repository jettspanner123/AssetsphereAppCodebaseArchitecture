import { ApiProperty } from '@nestjs/swagger';

export enum HealthStatusType {
  Healthy = 'Healthy',
  Degraded = 'Degraded',
  Unhealthy = 'Unhealthy',
}

export class SubsystemHealthDTO {
  @ApiProperty({ description: 'Name of the diagnostic subsystem', example: 'GeminiAiInferenceEngine' })
  public name: string;

  @ApiProperty({ enum: HealthStatusType, description: 'Current health state of the subsystem', example: 'Healthy' })
  public status: HealthStatusType;

  @ApiProperty({ description: 'Latency / execution response time in milliseconds', example: 4.2 })
  public latencyMs: number;

  @ApiProperty({ description: 'Subsystem operational details', example: 'Gemini 2.5 Flash ready for inference.' })
  public description: string;

  @ApiProperty({ description: 'Optional telemetry attributes', required: false })
  public telemetryData?: Record<string, any>;

  public constructor(
    name: string,
    status: HealthStatusType,
    latencyMs: number,
    description: string,
    telemetryData?: Record<string, any>
  ) {
    this.name = name;
    this.status = status;
    this.latencyMs = latencyMs;
    this.description = description;
    this.telemetryData = telemetryData;
  }
}

export class HealthCheckResponseDTO {
  @ApiProperty({ enum: HealthStatusType, description: 'Overall system health status', example: 'Healthy' })
  public overallStatus: HealthStatusType;

  @ApiProperty({ description: 'Service name identifier', example: 'AssetsphereAIServiceLayerMSC' })
  public serviceName: string;

  @ApiProperty({ description: 'Semantic version of the AI microservice', example: '1.0.0' })
  public version: string;

  @ApiProperty({ description: 'Runtime environment profile', example: 'development' })
  public environment: string;

  @ApiProperty({ description: 'Total system uptime in seconds', example: 1420.5 })
  public uptimeSeconds: number;

  @ApiProperty({ description: 'Diagnostics timestamp in UTC ISO format', example: '2026-08-28T12:00:00.000Z' })
  public timestamp: string;

  @ApiProperty({ type: [SubsystemHealthDTO], description: 'Detailed individual subsystem health breakdowns' })
  public subsystems: SubsystemHealthDTO[];

  @ApiProperty({ description: 'Host and OS system telemetry information' })
  public systemInfo: {
    nodeVersion: string;
    platform: string;
    architecture: string;
    memoryUsageMb: number;
    cpuCores: number;
    freeMemoryMb: number;
    totalMemoryMb: number;
  };

  public constructor(
    overallStatus: HealthStatusType,
    subsystems: SubsystemHealthDTO[],
    systemInfo: {
      nodeVersion: string;
      platform: string;
      architecture: string;
      memoryUsageMb: number;
      cpuCores: number;
      freeMemoryMb: number;
      totalMemoryMb: number;
    }
  ) {
    this.overallStatus = overallStatus;
    this.serviceName = 'AssetsphereAIServiceLayerMSC';
    this.version = '1.0.0';
    this.environment = process.env.NODE_ENV || 'development';
    this.uptimeSeconds = Math.round(process.uptime() * 100) / 100;
    this.timestamp = new Date().toISOString();
    this.subsystems = subsystems;
    this.systemInfo = systemInfo;
  }
}
