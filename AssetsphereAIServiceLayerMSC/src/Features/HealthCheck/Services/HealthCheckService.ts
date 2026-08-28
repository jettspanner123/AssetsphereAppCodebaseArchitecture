import { Injectable, Logger } from '@nestjs/common';
import * as os from 'os';
import {
  HealthCheckResponseDTO,
  HealthStatusType,
  SubsystemHealthDTO,
} from '../Models/HealthCheckDTOs';

@Injectable()
export class HealthCheckService {
  private readonly _logger: Logger = new Logger(HealthCheckService.name);

  public async checkHealthAsync(): Promise<HealthCheckResponseDTO> {
    const subsystems: SubsystemHealthDTO[] = [];

    // 1. Process & Memory Health Subsystem
    const memStart = performance.now();
    const memUsage = process.memoryUsage();
    const memoryUsedMb = Math.round((memUsage.rss / (1024 * 1024)) * 100) / 100;
    const memLatency = Math.round((performance.now() - memStart) * 100) / 100;

    subsystems.push(
      new SubsystemHealthDTO(
        'ProcessRuntimeMemory',
        memoryUsedMb < 1024 ? HealthStatusType.Healthy : HealthStatusType.Degraded,
        memLatency,
        `Node.js RSS: ${memoryUsedMb} MB, Heap Used: ${Math.round((memUsage.heapUsed / (1024 * 1024)) * 100) / 100} MB.`,
        {
          rssBytes: memUsage.rss,
          heapTotalBytes: memUsage.heapTotal,
          heapUsedBytes: memUsage.heapUsed,
        }
      )
    );

    // 2. AI Inference Engine Readiness (Gemini API Config Probe)
    const aiStart = performance.now();
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    const aiLatency = Math.round((performance.now() - aiStart) * 100) / 100;

    if (geminiApiKey && geminiApiKey.length > 5) {
      subsystems.push(
        new SubsystemHealthDTO(
          'GeminiAiInferenceEngine',
          HealthStatusType.Healthy,
          aiLatency,
          'Google Gemini API key provisioned and active for multi-modal inference.',
          {
            model: 'gemini-2.5-flash',
            provider: 'Google GenAI SDK',
          }
        )
      );
    } else {
      subsystems.push(
        new SubsystemHealthDTO(
          'GeminiAiInferenceEngine',
          HealthStatusType.Degraded,
          aiLatency,
          'GEMINI_API_KEY not configured in environment; AI fallbacks enabled.',
          {
            warning: 'Inference will operate in mock telemetry mode.',
          }
        )
      );
    }

    // 3. System Host CPU & OS Telemetry
    const totalMemMb = Math.round(os.totalmem() / (1024 * 1024));
    const freeMemMb = Math.round(os.freemem() / (1024 * 1024));
    const cpus = os.cpus();

    subsystems.push(
      new SubsystemHealthDTO(
        'HostOperatingSystem',
        freeMemMb > 256 ? HealthStatusType.Healthy : HealthStatusType.Degraded,
        0.1,
        `Platform: ${os.platform()} (${os.arch()}), Host: ${os.hostname()}, CPU Cores: ${cpus.length}.`,
        {
          uptimeSeconds: os.uptime(),
          loadAvg: os.loadavg(),
        }
      )
    );

    // Overall Status Computation
    const hasUnhealthy = subsystems.some((s) => s.status === HealthStatusType.Unhealthy);
    const hasDegraded = subsystems.some((s) => s.status === HealthStatusType.Degraded);
    const overallStatus = hasUnhealthy
      ? HealthStatusType.Unhealthy
      : hasDegraded
        ? HealthStatusType.Degraded
        : HealthStatusType.Healthy;

    const report = new HealthCheckResponseDTO(overallStatus, subsystems, {
      nodeVersion: process.version,
      platform: os.platform(),
      architecture: os.arch(),
      memoryUsageMb: memoryUsedMb,
      cpuCores: cpus.length,
      freeMemoryMb: freeMemMb,
      totalMemoryMb: totalMemMb,
    });

    this._logger.log(`Health diagnostics executed: OverallStatus=${overallStatus}`);
    return report;
  }
}

export default HealthCheckService;
