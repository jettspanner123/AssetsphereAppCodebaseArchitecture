export interface SecurityComplianceFramework {
  frameworkName: 'ISO 27001' | 'SOC2' | 'NIST' | 'CIS' | 'GDPR';
  overallScorePct: number;
  compliantDeviceCount: number;
  nonCompliantDeviceCount: number;
  criticalGaps: string[];
}
