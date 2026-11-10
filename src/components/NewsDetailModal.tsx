import React from 'react';
import { NewsItem } from '../data/news';
import { DEALERSHIP_INFO } from '../data/cars';
import { X, Calendar, ArrowUpRight, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';

interface NewsDetailModalProps {
  news: NewsItem | null;
  onClose: () => void;
  onRegisterInterest: (newsTitle: string) => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  news,
  onClose,
  onRegisterInterest
}) => {
  if (!news) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-[#1464F4] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {news.category}
            </span>
            <span className="text-xs text-slate-500 tabular-nums">
              Ngày đăng: {news.date}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] leading-snug">
            {news.title}
          </h2>

          {/* Image */}
          <div className="w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-auto object-cover max-h-80"
            />
          </div>

          <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl text-xs sm:text-sm font-semibold text-[#1E293B] leading-relaxed">
            {news.excerpt}
          </div>

          {/* Paragraphs */}
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {news.content.map((p, idx) => (
              <p key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#1464F4] shrink-0 mt-0.5" />
                <span>{p}</span>
              </p>
            ))}
          </div>

          <div className="pt-2 text-xs text-slate-500">
            Nguồn tin chính thức:{' '}
            <a
              href={news.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1464F4] font-bold hover:underline inline-flex items-center gap-0.5"
            >
              <span>VinFast Auto Việt Nam</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-bold text-slate-700">{DEALERSHIP_INFO.showroomName}</span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                onRegisterInterest(news.title);
                onClose();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all"
            >
              Đăng Ký Tư Vấn Chương Trình Này
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
