import React from 'react';
import { VINFAST_NEWS, NewsItem } from '../data/news';
import { Calendar, ArrowUpRight, ChevronRight, Newspaper } from 'lucide-react';

interface NewsSectionProps {
  onSelectNews: (news: NewsItem) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onSelectNews }) => {
  return (
    <section id="tin-tuc" className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[17px] font-bold text-[#1E293B]">
            Tin Tức Ô Tô Điện VinFast Mới Nhất
          </h2>
        </div>
        <a
          href="https://vinfastauto.com/vn_vi/tin-tuc/o-to-dien"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[#1464F4] hover:underline flex items-center gap-1"
        >
          <span>Xem tất cả tin tức</span>
          <ArrowUpRight size={14} />
        </a>
      </div>

      {/* 3 News Cards Grid matching exact layout in screenshots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {VINFAST_NEWS.map((item) => (
          <article
            key={item.id}
            onClick={() => onSelectNews(item)}
            className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              {/* Image banner */}
              <div className="w-full aspect-[4/3] bg-slate-100 overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {item.category}
                </div>
              </div>

              {/* Text content */}
              <div className="p-5 space-y-2">
                <h3 className="text-[14.5px] font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#1464F4] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed line-clamp-3">
                  {item.excerpt}
                </p>
              </div>
            </div>

            {/* Date Footer */}
            <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs text-[#94A3B8] border-t border-slate-50">
              <span className="tabular-nums font-medium">{item.date}</span>
              <span className="text-[#1464F4] font-bold text-xs inline-flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                Chi tiết <ChevronRight size={14} />
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
