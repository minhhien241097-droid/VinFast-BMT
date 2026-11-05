import React, { useState } from 'react';
import { HeaderMobile } from './components/HeaderMobile';
import { Sidebar } from './components/Sidebar';
import { BannerSection } from './components/BannerSection';
import { CarCatalog } from './components/CarCatalog';
import { NewsListModal } from './components/NewsListModal';
import { NewsDetailModal } from './components/NewsDetailModal';
import { LoanCalculatorModal } from './components/LoanCalculatorModal';
import { AccessoriesModal } from './components/AccessoriesModal';
import { PromotionsModal } from './components/PromotionsModal';
import { TestDriveModal } from './components/TestDriveModal';
import { RentalModal } from './components/RentalModal';
import { QuoteModal } from './components/QuoteModal';
import { CarDetailModal } from './components/CarDetailModal';
import { AdminLeadsModal } from './components/AdminLeadsModal';
import { Toast } from './components/Toast';
import { DEALERSHIP_INFO, VINFAST_CARS } from './data/cars';
import { CarModel } from './types';
import { NewsItem } from './data/news';
import { FloatingActions } from './components/FloatingActions';
import { AiAdvisorWidget } from './components/AiAdvisorWidget';
import { MapPin, Phone, MessageSquare, ShieldCheck, Zap, Lock } from 'lucide-react';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  // Modals state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorCarId, setCalculatorCarId] = useState<string>('vf3');

  const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
  const [isPromotionsOpen, setIsPromotionsOpen] = useState(false);
  
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [testDriveCarId, setTestDriveCarId] = useState<string>('vf3');

  const [isRentalOpen, setIsRentalOpen] = useState(false);
  const [isNewsListOpen, setIsNewsListOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteCar, setQuoteCar] = useState<CarModel | null>(null);
  const [isAdminLeadsOpen, setIsAdminLeadsOpen] = useState(false);

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [detailCar, setDetailCar] = useState<CarModel | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelectOverview = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCalculatorForCar = (car: CarModel) => {
    setCalculatorCarId(car.id);
    setIsCalculatorOpen(true);
  };

  const handleOpenTestDriveForCar = (car: CarModel) => {
    setTestDriveCarId(car.id);
    setIsTestDriveOpen(true);
  };

  const handleOpenQuoteForCar = (car: CarModel) => {
    setQuoteCar(car);
    setIsQuoteOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#EFF3F8] text-[#1E293B]">
      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Mobile Sticky Header */}
      <HeaderMobile
        isMenuOpen={isMobileMenuOpen}
        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onOpenQuote={() => {
          setQuoteCar(null);
          setIsQuoteOpen(true);
        }}
      />

      {/* Main Layout Wrapper */}
      <div className="max-w-[1240px] mx-auto p-3 sm:p-5 flex flex-col md:flex-row gap-5 items-start">
        
        {/* Left Sidebar */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onSelectOverview={handleSelectOverview}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenAccessories={() => setIsAccessoriesOpen(true)}
          onOpenPromotions={() => setIsPromotionsOpen(true)}
          onOpenTestDrive={() => setIsTestDriveOpen(true)}
          onOpenRental={() => setIsRentalOpen(true)}
          onOpenNews={() => setIsNewsListOpen(true)}
          onOpenAdminLeads={() => setIsAdminLeadsOpen(true)}
          onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        />

        {/* Right Main Content Area */}
        <main className="flex-1 w-full flex flex-col gap-6">
          
          {/* TẦNG 1: DUAL RESPONSIVE BANNER */}
          <BannerSection
            onOpenTestDrive={() => setIsTestDriveOpen(true)}
            onOpenPromotions={() => setIsPromotionsOpen(true)}
          />

          {/* TẦNG 2: BẢNG GIÁ VÀ DÒNG XE ĐIỆN VINFAST MỚI NHẤT */}
          <CarCatalog
            onSelectCarDetail={(car) => setDetailCar(car)}
            onOpenCalculatorForCar={handleOpenCalculatorForCar}
            onOpenTestDriveForCar={handleOpenTestDriveForCar}
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

              {/* Action Buttons: Zalo, Hotline, Facebook */}
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={DEALERSHIP_INFO.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#EBF3FF] text-[#1464F4] hover:bg-blue-100 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare size={14} />
                  <span>Zalo: {DEALERSHIP_INFO.hotline}</span>
                </a>

                <a
                  href={`tel:${DEALERSHIP_INFO.hotline.replace(/\./g, '')}`}
                  className="px-3.5 py-2 bg-[#1464F4] text-white hover:bg-blue-600 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Phone size={14} />
                  <span>Hotline: {DEALERSHIP_INFO.hotline}</span>
                </a>

                <a
                  href={DEALERSHIP_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-blue-50/80 text-[#1877F2] hover:bg-blue-100 border border-blue-200/80 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>{DEALERSHIP_INFO.facebookName}</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-[#1464F4] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div>
                    <span className="font-bold text-slate-800">CN Đồng Xoài:</span>{' '}
                    <span>525 Phú Riềng Đỏ, P Bình Phước, TP Đồng Nai.</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">CN Đồng Phú:</span>{' '}
                    <span>KCN Bắc Đồng Phú, P Đồng Phú, TP Đồng Nai.</span>
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

          {/* Copyright & Admin Footer */}
          <footer className="py-4 text-xs text-slate-500 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              © {new Date().getFullYear()} {DEALERSHIP_INFO.brandName} - Đại lý ủy quyền VinFast {DEALERSHIP_INFO.tier}. Bảng giá & chính sách được cập nhật chính hãng VinFast Việt Nam.
            </div>
            <button
              type="button"
              onClick={() => setIsAdminLeadsOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              <Lock size={12} />
              <span>Đăng nhập</span>
            </button>
          </footer>

        </main>
      </div>

      {/* Floating Action Buttons */}
      <FloatingActions
        onOpenQuote={() => {
          setQuoteCar(null);
          setIsQuoteOpen(true);
        }}
        onToggleAiAdvisor={() => setIsAiAdvisorOpen((prev) => !prev)}
        isAiAdvisorOpen={isAiAdvisorOpen}
      />

      {/* AI Advisor 24/7 Widget */}
      <AiAdvisorWidget
        isOpen={isAiAdvisorOpen}
        onToggle={() => setIsAiAdvisorOpen((prev) => !prev)}
        onSelectCarDetail={(car) => setDetailCar(car)}
        onOpenCalculatorForCar={handleOpenCalculatorForCar}
        onOpenTestDriveForCar={handleOpenTestDriveForCar}
        onOpenQuoteForCar={handleOpenQuoteForCar}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      {/* Modals */}
      <NewsListModal
        isOpen={isNewsListOpen}
        onClose={() => setIsNewsListOpen(false)}
        onSelectNewsItem={(news) => {
          setSelectedNews(news);
        }}
      />

      <NewsDetailModal
        news={selectedNews}
        onClose={() => setSelectedNews(null)}
        onRegisterInterest={(title) => {
          setQuoteCar(null);
          setIsQuoteOpen(true);
          setToastMessage(`Đã gửi yêu cầu tư vấn chương trình: "${title}".`);
        }}
      />

      <LoanCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        initialCarId={calculatorCarId}
        onRequestQuoteWithCalculation={(car, details) => {
          setQuoteCar(car);
          setIsQuoteOpen(true);
          setToastMessage(`Đã chuyển dự toán lăn bánh ${car.name} sang form nhận báo giá.`);
        }}
      />

      <AccessoriesModal
        isOpen={isAccessoriesOpen}
        onClose={() => setIsAccessoriesOpen(false)}
        onConsultationRequest={(items, total) => {
          setToastMessage(`Đã ghi nhận yêu cầu tư vấn ${items.length} món phụ kiện & bảo hiểm.`);
        }}
      />

      <PromotionsModal
        isOpen={isPromotionsOpen}
        onClose={() => setIsPromotionsOpen(false)}
        onClaimPromotion={(title) => {
          setQuoteCar(null);
          setIsQuoteOpen(true);
          setToastMessage(`Đã áp dụng ưu đãi: "${title}" vào form báo giá.`);
        }}
      />

      <TestDriveModal
        isOpen={isTestDriveOpen}
        onClose={() => setIsTestDriveOpen(false)}
        preselectedCarId={testDriveCarId}
      />

      <RentalModal
        isOpen={isRentalOpen}
        onClose={() => setIsRentalOpen(false)}
        onRequestRentalQuote={(carName, days) => {
          setToastMessage(`Đã ghi nhận đăng ký thuê xe ${carName} (${days} ngày). Chuyên viên sẽ gọi lại ngay.`);
        }}
      />

      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        preselectedCar={quoteCar}
      />

      <CarDetailModal
        car={detailCar}
        onClose={() => setDetailCar(null)}
        onOpenCalculator={handleOpenCalculatorForCar}
        onOpenTestDrive={handleOpenTestDriveForCar}
        onOpenQuote={handleOpenQuoteForCar}
      />

      <AdminLeadsModal
        isOpen={isAdminLeadsOpen}
        onClose={() => setIsAdminLeadsOpen(false)}
      />
    </div>
  );
}
