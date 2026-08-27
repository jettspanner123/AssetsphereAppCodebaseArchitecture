import React, { useRef, useState } from 'react';
import { Asset } from '../../Types/AssetType';
import ModalSharedComponent from '../../Shared/Components/ModalSharedComponent';
import ButtonSharedComponent from '../../Shared/Components/ButtonSharedComponent';
import { Printer, ExternalLink, Copy, Check, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

export interface QRBadgeModalControllerProps {
  asset: Asset | null;
  onClose: () => void;
}

export default function QRBadgeModalController({
  asset,
  onClose,
}: QRBadgeModalControllerProps): React.JSX.Element {
  const [copied, setCopied] = useState<boolean>(false);
  const lastAssetRef = useRef<Asset | null>(asset);
  if (asset) {
    lastAssetRef.current = asset;
  }
  const displayAsset = asset || lastAssetRef.current;

  if (!displayAsset) return <React.Fragment />;

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://assetsphere-weplm.vercel.app';

  const passportUrl = `${origin}/asset-passport?id=${encodeURIComponent(displayAsset.id || displayAsset.assetNumber)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(passportUrl);
      setCopied(true);
      toast.success('Asset Passport Link Copied', {
        description: 'URL copied to clipboard for easy sharing.',
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  const handleOpenPassport = () => {
    window.open(passportUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <ModalSharedComponent
      isOpen={Boolean(asset)}
      onClose={onClose}
      title="Asset Digital Passport & Physical Badge"
      subtitle={`Asset ID: ${displayAsset.assetNumber}`}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Printable Physical Badge Card */}
        <div
          id="printable-asset-badge"
          className="p-5 bg-white text-slate-900 border border-slate-300 rounded-xl shadow-sm space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#0C2086] rounded-full" />
              <span className="font-extrabold text-sm tracking-tight text-slate-900">
                AssetSphere Enterprise
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Tag
            </span>
          </div>

          {/* Body with Dynamic QR Code & Specs */}
          <div className="flex items-center gap-5">
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm shrink-0 flex flex-col items-center">
              <QRCodeSVG
                value={passportUrl}
                size={110}
                level="H"
                includeMargin={false}
              />
              <span className="text-[9px] font-mono font-bold text-slate-600 mt-1.5 tracking-wider">
                SCAN TO VERIFY
              </span>
            </div>

            <div className="space-y-1.5 min-w-0 flex-1 font-mono text-[11px] text-slate-700">
              <div className="text-xs font-bold text-[#0C2086] font-sans">
                {displayAsset.assetNumber}
              </div>
              <div className="font-bold text-sm text-slate-900 font-sans leading-snug line-clamp-2">
                {displayAsset.deviceName}
              </div>
              <div className="text-[11px] text-slate-600">
                <span className="text-slate-400">S/N:</span> {displayAsset.serialNumber || 'N/A'}
              </div>
              <div className="text-[11px] text-slate-600">
                <span className="text-slate-400">TAG:</span> {displayAsset.companyTag || 'N/A'}
              </div>
              <div className="text-[11px] text-slate-600 truncate">
                <span className="text-slate-400">DEPT:</span> {displayAsset.department || 'Unassigned'}
              </div>
            </div>
          </div>

          {/* Barcode & Footer Notice */}
          <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>BARCODE: {displayAsset.barcodeValue || displayAsset.assetNumber}</span>
            <span>{displayAsset.currentLocation || 'Corporate HQ'}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <ButtonSharedComponent
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            icon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            className="w-full"
          >
            {copied ? 'Link Copied' : 'Copy Passport URL'}
          </ButtonSharedComponent>

          <ButtonSharedComponent
            variant="outline"
            size="sm"
            onClick={handleOpenPassport}
            icon={<ExternalLink className="w-4 h-4" />}
            className="w-full"
          >
            Open Passport
          </ButtonSharedComponent>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-zinc-800">
          <ButtonSharedComponent variant="outline" size="sm" onClick={onClose}>
            Close
          </ButtonSharedComponent>
          <ButtonSharedComponent
            variant="primary"
            size="sm"
            onClick={() => window.print()}
            icon={<Printer className="w-4 h-4" />}
          >
            Print Badge Tag
          </ButtonSharedComponent>
        </div>
      </div>
    </ModalSharedComponent>
  );
}
