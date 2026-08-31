import React from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import AssetPassportScreenController from '../Features/AssetPassport/AssetPassportScreenController';
import TanstackQueryClientService from '../Services/TanstackQueryClientService';
import ApplicationRouteCON from '../Constants/ApplicationRouteCON';
import { Asset } from '../Types/AssetType';

export default function AssetPassportScreenRoute(): React.JSX.Element {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { id?: string; assetId?: string; search?: string };
  const targetId = (search.id || search.assetId || search.search || '').trim().toLowerCase();

  const { data: dbAssets = [], isLoading } = TanstackQueryClientService.current.assets.useAssetsQuery();

  // Strictly live database assets
  const allAssets: Asset[] = dbAssets;

  const foundAsset = targetId
    ? allAssets.find(
        (a) =>
          a.id.toLowerCase() === targetId ||
          a.assetNumber.toLowerCase() === targetId ||
          (a.serialNumber && a.serialNumber.toLowerCase() === targetId) ||
          (a.companyTag && a.companyTag.toLowerCase() === targetId)
      ) || null
    : allAssets[0] || null;

  return (
    <AssetPassportScreenController
      asset={foundAsset}
      isLoading={isLoading && dbAssets.length === 0}
      onNavigateHome={() => navigate({ to: ApplicationRouteCON.ROOT })}
      onNavigateServiceRequests={(assetId: string) => {
        navigate({
          to: ApplicationRouteCON.DASHBOARD_DEVICE_SERVICE_REQUESTS,
          search: (prev: any) => ({
            ...prev,
            newRequest: 'true',
            assetId: assetId,
          }),
        });
      }}
    />
  );
}
