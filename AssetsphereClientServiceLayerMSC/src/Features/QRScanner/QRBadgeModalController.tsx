import React from 'react';
import { Asset } from '../../Types/AssetType';
import ModalSharedComponent from '../../Shared/Components/ModalSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';
import { Printer, QrCode } from 'lucide-react';

export interface QRBadgeModalControllerProps {
  asset: Asset | null;
  onClose: () => void;
}

export default function QRBadgeModalController({
  asset,
  onClose,
}: QRBadgeModalControllerProps): React.JSX.Element {
  if (!asset) return <React.Fragment />;

  return (
    <ModalSharedComponent
      isOpen={Boolean(asset)}
      onClose={onClose}
      title="Print Physical Asset Barcode Tag"
      subtitle={`Tag ID: ${asset.assetNumber}`}
      maxWidth="md"
    >
      <div className="space-y-4 text-center">
        <div className="p-6 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-xl inline-block shadow-inner">
          <div className="w-40 h-40 mx-auto bg-slate-900 dark:bg-white text-white dark:text-black flex flex-col items-center justify-center p-3 rounded-lg font-mono">
            <QrCode className="w-24 h-24" />
            <span className="text-xs font-bold mt-2">{asset.assetNumber}</span>
          </div>
          <div className="mt-3 text-xs text-slate-700 dark:text-zinc-300 font-semibold font-serif-headline">
            {asset.deviceName}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">S/N: {asset.serialNumber}</div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <ButtonSharedComponent variant="outline" size="sm" onClick={onClose}>
            Close
          </ButtonSharedComponent>
          <ButtonSharedComponent
            variant="primary"
            size="sm"
            onClick={() => window.print()}
            icon={<Printer className="w-4 h-4" />}
          >
            Print Barcode Label
          </ButtonSharedComponent>
        </div>
      </div>
    </ModalSharedComponent>
  );
}
