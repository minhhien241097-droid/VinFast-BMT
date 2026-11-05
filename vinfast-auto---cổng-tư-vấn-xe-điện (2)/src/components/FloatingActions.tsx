import React, { useState, useEffect } from 'react';
import { DEALERSHIP_INFO } from '../data/cars';
import { Bot, Sparkles, X } from 'lucide-react';

interface FloatingActionsProps {
  onOpenQuote: () => void;
  onToggleAiAdvisor: () => void;
  isAiAdvisorOpen: boolean;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onOpenQuote,
  onToggleAiAdvisor,
  isAiAdvisorOpen
}) => {
  const [showGreetingBubble, setShowGreetingBubble] = useState(false);
  const [hasDismissedBubble, setHasDismissedBubble] = useState(false);

  // Tự động hiện bong bóng chào sau khi vào web 10 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreetingBubble(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Nếu người dùng mở khung chat thì ẩn bong bóng chào nhỏ đi
  useEffect(() => {
    if (isAiAdvisorOpen) {
      setShowGreetingBubble(false);
      setHasDismissedBubble(true);
    }
  }, [isAiAdvisorOpen]);

  if (isAiAdvisorOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Auto Greeting Mini Chat Bubble after 10s */}
      {showGreetingBubble && !hasDismissedBubble && (
        <div className="relative max-w-[265px] sm:max-w-[290px] bg-white rounded-2xl rounded-br-xs p-3 shadow-[0_10px_30px_rgba(15,23,42,0.18)] border border-blue-200 animate-in fade-in slide-in-from-bottom-3 duration-300 mb-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowGreetingBubble(false);
              setHasDismissedBubble(true);
            }}
            aria-label="Đóng lời chào"
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xs hover:bg-slate-700 cursor-pointer"
          >
            <X size={11} />
          </button>

          <div
            onClick={onToggleAiAdvisor}
            className="flex items-start gap-2.5 cursor-pointer group"
          >
            <div className="relative shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#1464F4] flex items-center justify-center text-white shadow-2xs">
                <Bot size={16} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="text-[11px] font-extrabold text-[#1464F4]">
                  Trợ lý VinFast 3S
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">● Online</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-snug group-hover:text-slate-900">
                VinFast 3S xin chào, anh/chị cần hỗ trợ gì nhắn em nha! 👋
              </p>
              <span className="inline-block mt-1 text-[10.5px] font-bold text-[#1464F4] group-hover:underline">
                Bấm để chat ngay →
              </span>
            </div>
          </div>
        </div>
      )}

      {/* AI Advisor 24/7 Button */}
      <button
        type="button"
        onClick={onToggleAiAdvisor}
        className="group relative bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#1464F4] hover:from-[#1E293B] hover:to-[#0D52D6] text-white py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold shadow-[0_8px_24px_rgba(20,100,244,0.35)] flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        title="Mở Trợ lý AI Tư vấn Xe Điện 24/7"
      >
        <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/15">
          <Bot size={15} className="text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0F172A] rounded-full" />
        </span>
        <span>Trợ lý AI 24/7</span>
        <Sparkles size={13} className="text-amber-300" />
      </button>

      {/* Quick Zalo button */}
      <a
        href={DEALERSHIP_INFO.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex items-center gap-2 bg-[#0068FF] hover:bg-[#0055D4] text-white px-3.5 py-2 rounded-full text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
        title="Nhắn Zalo tư vấn viên"
      >
        <span className="text-sm">💬</span>
        <span>Zalo Tư Vấn</span>
      </a>
    </div>
  );
};
