import React, { useState } from 'react';
import { Asset } from '../../types';
import ModalSharedComponent from '../../Shared/Components/ModalSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';
import { Camera, CheckCircle2, QrCode } from 'lucide-react';

export interface QRScannerModalControllerProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifyAsset: (assetId: string) => void;
  assets: Asset[];
}

export default function QRScannerModalController({
  isOpen,
  onClose,
  onVerifyAsset,
  assets,
}: QRScannerModalControllerProps): React.JSX.Element {
  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null);

  const handleSimulateScan = () => {
    const randomAsset = assets[Math.floor(Math.random() * assets.length)];
    setScannedAsset(randomAsset);
  };

  const handleConfirmVerify = () => {
    if (scannedAsset) {
      onVerifyAsset(scannedAsset.id);
      onClose();
      setScannedAsset(null);
    }
  };

  return (
    <ModalSharedComponent
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setScannedAsset(null);
      }}
      title="Barcode & Asset Tag Camera Scanner"
      subtitle="Physical verification audit capture"
      maxWidth="md"
    >
      <div className="space-y-4 text-center text-xs">
        <div className="relative w-full h-48 rounded-xl bg-slate-900 flex flex-col items-center justify-center text-white overflow-hidden border border-slate-700">
          <Camera className="w-10 h-10 text-sky-400 animate-pulse mb-2" />
          <span className="font-mono text-slate-400">Position 2D Barcode / QR Code inside viewport</span>
          <div className="absolute inset-8 border-2 border-sky-400/50 rounded-lg pointer-events-none" />
        </div>

        {scannedAsset ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-left space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold font-serif-headline">
              <CheckCircle2 className="w-4 h-4" /> Barcode Scanned Successfully!
            </div>
            <div className="font-mono font-bold text-slate-900 dark:text-white">
              {scannedAsset.assetNumber} — {scannedAsset.deviceName}
            </div>
            <div className="text-[11px] text-slate-500">
              Serial: {scannedAsset.serialNumber} • Owner: {scannedAsset.assignedToEmployeeName || 'Unassigned'}
            </div>
            <ButtonSharedComponent variant="primary" size="sm" fullWidth onClick={handleConfirmVerify}>
              Confirm Physical Audit Signature
            </ButtonSharedComponent>
          </div>
        ) : (
          <ButtonSharedComponent variant="primary" size="sm" fullWidth onClick={handleSimulateScan}>
            Simulate Camera Barcode Detection
          </ButtonSharedComponent>
        )}
      </div>
    </ModalSharedComponent>
  );
}
