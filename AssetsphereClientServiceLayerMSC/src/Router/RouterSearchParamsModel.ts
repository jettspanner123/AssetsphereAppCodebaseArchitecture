import { z } from 'zod';

export const DashboardSearchSchema = z.object({
  search: z.string().optional(),
  selectedAssetId: z.string().optional(),
  assetTab: z
    .enum(['specs', 'procurement', 'warranty', 'security', 'timeline', 'ai_diagnostics'])
    .optional(),
  selectedEmployeeId: z.string().optional(),
  employeeTab: z.enum(['overview', 'assigned_assets', 'activity']).optional(),
  editEmployeeId: z.string().optional(),
  newAsset: z.boolean().optional(),
  newEmployee: z.boolean().optional(),
  scanner: z.boolean().optional(),
  qrAssetId: z.string().optional(),
  status: z.string().optional(),
  view: z.enum(['grid', 'table', 'list']).optional(),
  cols: z.union([z.literal(2), z.literal(3)]).optional(),
  singleLine: z.boolean().optional(),
});

export type DashboardSearchParams = z.infer<typeof DashboardSearchSchema>;
