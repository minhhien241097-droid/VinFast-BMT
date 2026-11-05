import React, { useState } from 'react';
import { VINFAST_NEWS, NewsItem } from '../data/news';
import { X, Calendar, ChevronRight, ArrowUpRight, Newspaper, CheckCircle2 } from 'lucide-react';

interface NewsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNewsItem: (news: NewsItem) => void;
}

export const NewsListModal: React.FC<NewsListModalProps> = ({
  isOpen,
  onClose,
  onSelectNewsItem
}) => {
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-4xl rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-slate-800 to-[#0D3880] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-xl shrink-0">
              📰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                  Tin Tức Mới Nhất
                </h2>
                <span className="bg-blue-500/25 border border-blue-400/30 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  VinFast
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Cập nhật thông tin ưu đãi, sự kiện và công nghệ ô tô điện mới nhất
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Đóng popup tin tức"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content: 3 News Articles */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/60">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {VINFAST_NEWS.map((item) => (
              <article
                key={item.id}
                onClick={() => {
                  onSelectNewsItem(item);
                }}
                className="bg-white rounded-[20px] overflow-hidden shadow-xs hover:shadow-lg border border-slate-200/80 hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Image banner with actual uploaded high-res image */}
                  <div className="w-full aspect-[16/10] bg-slate-100 overflow-hidden relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {item.category}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 sm:p-5 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400 font-medium">
                      <Calendar size={13} className="text-[#1464F4]" />
                      <span className="tabular-nums">{item.date}</span>
                    </div>

                    <h3 className="text-[14px] font-extrabold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#1464F4] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-[12.5px] text-slate-600 leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer read button */}
                <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1464F4] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Xem nội dung chi tiết</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Official link box */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-base">📌</span>
              <span>Thông tin chính thức được phát hành bởi hệ thống VinFast Auto Việt Nam.</span>
            </div>
            <a
              href="https://vinfastauto.com/vn_vi/tin-tuc/o-to-dien"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1464F4] font-bold hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Xem trang tin tổng hợp VinFast</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
