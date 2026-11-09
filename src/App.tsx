import React, { useState } from 'react';
import { HeaderMobile } from './components/HeaderMobile';
import { Sidebar } from './components/Sidebar';
import { BannerSection } from './components/BannerSection';
import { CarCatalog } from './components/CarCatalog';
import { LoanCalculatorModal } from './components/LoanCalculatorModal';
import { PromotionsModal } from './components/PromotionsModal';
import { CarDetailModal } from './components/CarDetailModal';
import { DEALERSHIP_INFO } from './data/cars';
import { CarModel } from './types';
import { FloatingActions } from './components/FloatingActions';
import { AiAdvisorWidget } from './components/AiAdvisorWidget';
import { MapPin, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  // Modals state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorCarId, setCalculatorCarId] = useState<string>('vf3');

  const [isPromotionsOpen, setIsPromotionsOpen] = useState(false);
  const [detailCar, setDetailCar] = useState<CarModel | null>(null);

  const handleSelectOverview = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCalculatorForCar = (car: CarModel) => {
    setCalculatorCarId(car.id);
    setIsCalculatorOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#EFF3F8] text-[#1E293B] overflow-x-hidden">
      {/* Mobile Sticky Header */}
      <HeaderMobile
        isMenuOpen={isMobileMenuOpen}
        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Layout Wrapper */}
      <div className="max-w-[1240px] mx-auto p-3 sm:p-5 flex flex-col md:flex-row gap-5 items-start">
        
        {/* Left Sidebar */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onSelectOverview={handleSelectOverview}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenPromotions={() => setIsPromotionsOpen(true)}
        />

        {/* Right Main Content Area */}
        <main className="flex-1 w-full flex flex-col gap-6">
          
          {/* TẦNG 1: DUAL RESPONSIVE BANNER */}
          <BannerSection
            onOpenPromotions={() => setIsPromotionsOpen(true)}
          />

          {/* TẦNG 2: BẢNG GIÁ VÀ DÒNG XE ĐIỆN VINFAST MỚI NHẤT */}
          <CarCatalog
            onSelectCarDetail={(car) => setDetailCar(car)}
            onOpenCalculatorForCar={handleOpenCalculatorForCar}
          />

          {/* TẦNG 3: KHỐI THÔNG TIN ĐẠI LÝ VINFAST BÌNH PHƯỚC */}
          <section className="p-6 sm:p-7 bg-white rounded-[22px] border border-slate-100 shadow-[0_4px_18px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-slate-900 tracking-wide uppercase">
                    {DEALERSHIP_INFO.showroomName}
                  </span>
                  <span className="bg-purple-100 text-[#6D28D9] text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                    Đại lý {DEALERSHIP_INFO.tier} chính hãng
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {DEALERSHIP_INFO.role} - Phụ trách {DEALERSHIP_INFO.coverageArea}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-[#1464F4] shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <div>
                    <span className="font-bold text-slate-800">VinFast Bình Phước:</span>{' '}
                    <span>Đường D1, KCN Bắc Đồng Phú, Phường Đồng Phú, TP Đồng Nai</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">CN Đồng Xoài:</span>{' '}
                    <span>525 Phú Riềng Đỏ, P Bình Phước, TP Đồng Nai</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">CN Phước Long:</span>{' '}
                    <span>KP Bình Giang, P. Phước Long, TP Đồng Nai</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">CN Bình Long:</span>{' '}
                    <span>Đường Nguyễn Huệ, P Bình Long, TP Đồng Nai</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <ShieldCheck size={16} className="text-[#1464F4] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Bảo hành xe & Pin:</span>
                  <span>Bảo hành xe 7 - 10 năm, cứu hộ 24/7 miễn phí toàn quốc.</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Zap size={16} className="text-[#1464F4] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Trạm sạc V-GREEN:</span>
                  <span>Mạng lưới trạm sạc điện phủ kín 63 tỉnh thành phố.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Copyright Footer */}
          <footer className="py-4 text-xs text-slate-500 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              © {new Date().getFullYear()} {DEALERSHIP_INFO.brandName} - Đại lý ủy quyền VinFast {DEALERSHIP_INFO.tier}. Bảng giá & chính sách được cập nhật chính hãng VinFast Việt Nam.
            </div>
          </footer>

        </main>
      </div>

      {/* Floating Action Buttons */}
      <FloatingActions
        onToggleAiAdvisor={() => setIsAiAdvisorOpen((prev) => !prev)}
        isAiAdvisorOpen={isAiAdvisorOpen}
      />

      {/* AI Advisor 24/7 Widget */}
      <AiAdvisorWidget
        isOpen={isAiAdvisorOpen}
        onToggle={() => setIsAiAdvisorOpen((prev) => !prev)}
        onSelectCarDetail={(car) => setDetailCar(car)}
        onOpenCalculatorForCar={handleOpenCalculatorForCar}
      />

      {/* Modals */}
      <LoanCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        initialCarId={calculatorCarId}
      />

      <PromotionsModal
        isOpen={isPromotionsOpen}
        onClose={() => setIsPromotionsOpen(false)}
      />

      <CarDetailModal
        car={detailCar}
        onClose={() => setDetailCar(null)}
        onOpenCalculator={handleOpenCalculatorForCar}
      />
    </div>
  );
}
