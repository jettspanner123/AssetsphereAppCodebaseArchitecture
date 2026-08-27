import React from 'react';
import { Asset } from '../Types/AssetType';
import { X, Printer, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRBadgeModalProps {
  asset: Asset;
  onClose: () => void;
}

export const QRBadgeModal: React.FC<QRBadgeModalProps> = ({ asset, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://assetsphere-weplm.vercel.app';

  const passportUrl = `${origin}/asset-passport?id=${encodeURIComponent(asset.id || asset.assetNumber)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#161618] border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-slate-300">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="font-semibold text-sm text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" /> Print Asset QR Tag Label
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex flex-col items-center">
          {/* Print Badge Card */}
          <div
            id="printable-badge"
            className="w-full bg-white text-slate-900 rounded-xl p-5 border-2 border-slate-900 shadow-xl space-y-3 font-sans"
          >
            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <div className="font-extrabold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
                AssetSphere Enterprise
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">PROPERTY OF ENT CORP</span>
            </div>

            <div className="flex items-center gap-4 py-1">
              {/* Dynamic Vector SVG QR Code */}
              <div className="w-28 h-28 bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-center shrink-0 shadow-sm">
                <QRCodeSVG
                  value={passportUrl}
                  size={96}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="space-y-1 font-mono text-[11px] text-slate-800">
                <div className="text-xs font-bold text-indigo-600">{asset.assetNumber}</div>
                <div className="font-bold text-sm text-slate-900 font-sans leading-tight line-clamp-2">
                  {asset.deviceName}
                </div>
                <div className="text-[10px] text-slate-600">S/N: {asset.serialNumber}</div>
                <div className="text-[10px] text-slate-600">TAG: {asset.companyTag}</div>
              </div>
            </div>

            {/* Barcode Simulation */}
            <div className="pt-2 border-t border-slate-200 text-center">
              <div className="h-8 bg-slate-900 rounded flex items-center justify-around px-2">
                {[...Array(28)].map((_, i) => (
                  <span
                    key={i}
                    className="bg-white h-full"
                    style={{ width: i % 3 === 0 ? '3px' : i % 2 === 0 ? '1px' : '2px' }}
                  />
                ))}
              </div>
              <div className="text-[9px] font-mono text-slate-600 mt-1">{asset.barcodeValue || '904100123841'}</div>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Label Badge
          </button>
        </div>
      </div>
    </div>
  );
};
