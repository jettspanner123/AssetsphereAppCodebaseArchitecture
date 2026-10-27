import { TestInfo } from '@playwright/test';

export type PerformanceMetricValue = number | boolean | string;

export type PerformanceMetricRecord = {
  testName: string;
  timestamp: string;
  metrics: Record<string, PerformanceMetricValue>;
};

/**
 * Captures timing/behavioral data from a test run for later analysis. Currently
 * prints to console and attaches to the Playwright report; once a database
 * exists, swap the body of `record` for a DB write without touching call sites.
 */
export default class PerformanceMetricsUtility {
  public static readonly current: PerformanceMetricsUtility = new PerformanceMetricsUtility();
  private constructor() {}

  public record(testName: string, metrics: Record<string, PerformanceMetricValue>, testInfo?: TestInfo): void {
    const metricRecord: PerformanceMetricRecord = {
      testName,
      timestamp: new Date().toISOString(),
      metrics,
    };

    console.log(`[PerformanceMetrics] ${JSON.stringify(metricRecord)}`);

    testInfo?.annotations.push({
      type: 'performance-metrics',
      description: JSON.stringify(metricRecord),
    });
  }
}
