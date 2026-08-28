import { Injectable, Logger } from '@nestjs/common';
import * as os from 'os';
import {
  HealthCheckResponseDTO,
  HealthStatusType,
  ComponentHealthDTO,
  RuntimeHealthDTO,
} from '../Models/HealthCheckDTOs';

@Injectable()
export class HealthCheckService {
  private readonly _logger: Logger = new Logger(HealthCheckService.name);

  public async CheckHealthAsync(): Promise<HealthCheckResponseDTO> {
    const overallStart = performance.now();
    const subsystems: ComponentHealthDTO[] = [];

    // 1. Process & Memory Health Subsystem
    const memStart = performance.now();
    const memUsage = process.memoryUsage();
    const memoryUsedMb = Math.round((memUsage.rss / (1024 * 1024)) * 100) / 100;
    const memLatency = Math.round(performance.now() - memStart);

    subsystems.push(
      new ComponentHealthDTO(
        'ProcessRuntimeMemory',
        memoryUsedMb < 1024 ? HealthStatusType.Healthy : HealthStatusType.Degraded,
        memLatency,
        `Node.js RSS: ${memoryUsedMb} MB, Heap: ${Math.round((memUsage.heapUsed / (1024 * 1024)) * 100) / 100} MB.`
      )
    );

    // 2. AI Inference Engine Readiness (Gemini API Config Probe)
    const aiStart = performance.now();
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    const aiLatency = Math.round(performance.now() - aiStart);

    if (geminiApiKey && geminiApiKey.length > 5) {
      subsystems.push(
        new ComponentHealthDTO(
          'GeminiAiInferenceEngine',
          HealthStatusType.Healthy,
          aiLatency,
          'Google Gemini 2.5 Flash SDK provisioned and active.'
        )
      );
    } else {
      subsystems.push(
        new ComponentHealthDTO(
          'GeminiAiInferenceEngine',
          HealthStatusType.Degraded,
          aiLatency,
          'GEMINI_API_KEY not configured in environment; AI fallbacks active.'
        )
      );
    }

    // 3. System Host CPU & OS Telemetry
    const cpus = os.cpus();
    const freeMemMb = Math.round(os.freemem() / (1024 * 1024));

    subsystems.push(
      new ComponentHealthDTO(
        'HostOperatingSystem',
        freeMemMb > 256 ? HealthStatusType.Healthy : HealthStatusType.Degraded,
        1,
        `Platform: ${os.platform()} (${os.arch()}), Host: ${os.hostname()}, CPU Cores: ${cpus.length}.`
      )
    );

    // Overall Status Computation
    const hasUnhealthy = subsystems.some((s) => s.Status === HealthStatusType.Unhealthy);
    const hasDegraded = subsystems.some((s) => s.Status === HealthStatusType.Degraded);
    const overallStatus = hasUnhealthy
      ? HealthStatusType.Unhealthy
      : hasDegraded
        ? HealthStatusType.Degraded
        : HealthStatusType.Healthy;

    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / (3600 * 24));
    const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);
    const formattedUptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const runtime = new RuntimeHealthDTO(
      process.env.NODE_ENV || 'Development',
      formattedUptime,
      memoryUsedMb,
      cpus.length,
      `Node.js ${process.version} (${os.platform()}-${os.arch()})`
    );

    const totalDurationMs = Math.round(performance.now() - overallStart);

    const report = new HealthCheckResponseDTO(
      overallStatus,
      totalDurationMs,
      runtime,
      subsystems
    );

    this._logger.log(`Health diagnostics executed: OverallStatus=${overallStatus}`);
    return report;
  }

  public async checkHealthAsync(): Promise<HealthCheckResponseDTO> {
    return this.CheckHealthAsync();
  }
}

export default HealthCheckService;
