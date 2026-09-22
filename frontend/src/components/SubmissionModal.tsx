import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Copy, Check, ExternalLink, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pilotToken: string;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({ isOpen, onClose, pilotToken }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handshakeUrl = `${window.location.origin}/handshake/${pilotToken}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(handshakeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDone = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-mono font-bold mb-2">
          SESSION RECORDED IN LEDGER
        </span>

        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Handshake Ready
        </h2>
        
        <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed">
          Provide this QR code to the pilot for immediate mobile scanning, or copy the direct handshake link below.
        </p>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl shadow-md mb-6 border border-slate-200">
          <QRCodeSVG 
            value={handshakeUrl} 
            size={180}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Copy Link Input Bar */}
        <div className="w-full flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 mb-6">
          <input
            type="text"
            readOnly
            value={handshakeUrl}
            className="flex-1 bg-transparent text-xs text-slate-700 font-mono outline-none px-2 truncate"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 shadow-2xs"
            title="Copy link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Actions */}
        <div className="w-full grid grid-cols-2 gap-3">
          <a
            href={handshakeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors border border-slate-200"
          >
            <span>Open Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleDone}
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default SubmissionModal;
