export interface AIRecommendation {
  id: string;
  assetId?: string;
  assetName?: string;
  category: 'Replacement' | 'Warranty Extension' | 'Hardware Upgrade' | 'Reallocation' | 'Cost Saving' | 'Security Risk';
  title: string;
  explanation: string;
  impact: 'High' | 'Medium' | 'Low';
  estimatedCostOrSaving: string;
  actionableStep: string;
}
