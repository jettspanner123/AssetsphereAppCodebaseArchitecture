import { z } from 'zod';

export const DashboardSearchSchema = z.object({
  search: z.string().optional(),
  selectedAssetId: z.string().optional(),
  assetTab: z
    .enum(['specs', 'procurement', 'warranty', 'security', 'timeline', 'ai_diagnostics'])
    .optional(),
  newAsset: z.boolean().optional(),
  scanner: z.boolean().optional(),
  qrAssetId: z.string().optional(),
  status: z.string().optional(),
  view: z.enum(['grid', 'table', 'kanban', 'list']).optional(),
  cols: z.union([z.literal(2), z.literal(3)]).optional(),
  singleLine: z.boolean().optional(),
});

export type DashboardSearchParams = z.infer<typeof DashboardSearchSchema>;
