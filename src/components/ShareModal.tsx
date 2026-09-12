import React from 'react';
import { useFarm } from '../context/FarmContext';
import { shareContent } from '../utils/shareUtils';
import { Share2, MessageCircle, Copy, X, Check } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const {
    isShareModalOpen,
    setIsShareModalOpen,
    shareModalData,
    showToast,
    t
  } = useFarm();

  const [copied, setCopied] = React.useState<boolean>(false);

  if (!isShareModalOpen || !shareModalData) return null;

  const textToShare = shareModalData.text || '';
  const titleToShare = shareModalData.title || t.share;

  const handleNativeShare = async () => {
    await shareContent({
      title: titleToShare,
      text: textToShare
    });
    setIsShareModalOpen(false);
  };

  const handleWhatsappShare = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    window.open(whatsappUrl, '_blank');
    setIsShareModalOpen(false);
  };

  const handleCopyClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textToShare);
      setCopied(true);
      showToast(t.copiedToClipboard);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      showToast('Could not copy to clipboard', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">{titleToShare}</h3>
              <p className="text-[11px] text-gray-500 font-medium">Select sharing method</p>
            </div>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Preview box */}
        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 max-h-36 overflow-y-auto scrollbar-thin">
          <pre className="text-xs text-gray-800 font-sans whitespace-pre-wrap leading-relaxed">
            {textToShare}
          </pre>
        </div>

        {/* Share Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* WhatsApp Direct Share */}
          <button
            onClick={handleWhatsappShare}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-4 rounded-2xl shadow-md flex items-center justify-center space-x-2 text-xs active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.shareViaWhatsapp}</span>
          </button>

          {/* Native Web Share */}
          <button
            onClick={handleNativeShare}
            className="w-full bg-farm-800 hover:bg-farm-900 text-white font-black py-3 px-4 rounded-2xl shadow-md flex items-center justify-center space-x-2 text-xs active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4 text-amber-300" />
            <span>{t.share} (Device Share)</span>
          </button>

          {/* Copy to Clipboard */}
          <button
            onClick={handleCopyClipboard}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 text-xs active:scale-95 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
            <span>{copied ? 'Copied!' : t.copyToClipboard}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
