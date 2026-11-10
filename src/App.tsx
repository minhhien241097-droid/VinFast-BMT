import React, { useState, useEffect } from 'react';
import { HeaderMobile } from './components/HeaderMobile';
import { Sidebar } from './components/Sidebar';
import { BannerSection } from './components/BannerSection';
import { CarCatalog } from './components/CarCatalog';
import { LoanCalculatorModal } from './components/LoanCalculatorModal';
import { PromotionsModal } from './components/PromotionsModal';
import { CarDetailModal } from './components/CarDetailModal';
import { TestDriveModal } from './components/TestDriveModal';
import { MaintenanceModal } from './components/MaintenanceModal';
import { InsuranceRescueModal } from './components/InsuranceRescueModal';
import { AccessoriesModal } from './components/AccessoriesModal';
import { RentalModal } from './components/RentalModal';
import { LeadConfirmationModal } from './components/LeadConfirmationModal';
import { AdminLeadsModal } from './components/AdminLeadsModal';
import { getDealershipByBranchId } from './data/cars';
import { CarModel } from './types';
import { CustomerLead } from './services/leadService';
import { FloatingActions } from './components/FloatingActions';
import { AiAdvisorWidget } from './components/AiAdvisorWidget';
import { Lock, MapPin, Phone, ShieldCheck, Zap } from 'lucide-react';

const extractBranchIdFromPath = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] || '';
};

export default function App() {
  const [branchId, setBranchId] = useState<string>(() =>
    extractBranchIdFromPath(window.location.pathname)
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  // Modals state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorCarId, setCalculatorCarId] = useState<string>('vf3');

  const [isPromotionsOpen, setIsPromotionsOpen] = useState(false);
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [isInsuranceOpen, setIsInsuranceOpen] = useState(false);
  const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
  const [isRentalOpen, setIsRentalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [detailCar, setDetailCar] = useState<CarModel | null>(null);
  const [confirmedLead, setConfirmedLead] = useState<CustomerLead | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setBranchId(extractBranchIdFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isHomePage = !branchId;
  const currentDealership = getDealershipByBranchId(branchId);

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
        dealership={currentDealership}
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
          onOpenTestDrive={() => setIsTestDriveOpen(true)}
          onOpenMaintenance={() => setIsMaintenanceOpen(true)}
          onOpenInsurance={() => setIsInsuranceOpen(true)}
          onOpenAccessories={() => setIsAccessoriesOpen(true)}
          onOpenRental={() => setIsRentalOpen(true)}
          isHomePage={isHomePage}
          dealership={currentDealership}
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

          {/* TẦNG 3: KHỐI THÔNG TIN ĐẠI LÝ VINFAST THEO CHI NHÁNH (/:branchId) */}
          <section className="p-6 sm:p-7 bg-white rounded-[22px] border border-slate-100 shadow-[0_4px_18px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-slate-900 tracking-wide uppercase">
                    {currentDealership.showroomName}
                  </span>
                  <span className="bg-purple-100 text-[#6D28D9] text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                    Đại lý {currentDealership.tier} chính hãng
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {currentDealership.role} - Phụ trách {currentDealership.coverageArea}
                </p>
              </div>

              {currentDealership.hotline && (
                <a
                  href={`tel:${currentDealership.hotline.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1464F4] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all shrink-0"
                >
                  <Phone size={16} />
                  <span>Liên hệ: {currentDealership.hotline}</span>
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-[#1464F4] shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  {currentDealership.branches.map((branch, idx) => (
                    <div key={idx}>
                      <span className="font-bold text-slate-800">{branch.name}:</span>{' '}
                      <span>{branch.address}</span>
                    </div>
                  ))}
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

          {/* Copyright Footer + Admin Login on VinFast 3S Home Page */}
          <footer className="py-4 text-xs text-slate-500 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              © {new Date().getFullYear()} {currentDealership.brandName} - Đại lý ủy quyền {currentDealership.showroomName}
              {currentDealership.showroomName.includes(currentDealership.tier) ? '' : ` ${currentDealership.tier}`}. Bảng giá & chính sách được cập nhật chính hãng VinFast Việt Nam.
            </div>

            {isHomePage && (
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#1464F4] font-semibold transition-colors cursor-pointer shrink-0"
              >
                <Lock size={12} />
                <span>Đăng nhập</span>
              </button>
            )}
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
        dealership={currentDealership}
      />

      {/* Modals */}
      <LoanCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        initialCarId={calculatorCarId}
        isHomePage={isHomePage}
        onLeadSubmitted={(lead) => setConfirmedLead(lead)}
      />

      <PromotionsModal
        isOpen={isPromotionsOpen}
        onClose={() => setIsPromotionsOpen(false)}
      />

      <TestDriveModal
        isOpen={isTestDriveOpen}
        onClose={() => setIsTestDriveOpen(false)}
        onLeadSubmitted={(lead) => setConfirmedLead(lead)}
      />

      <MaintenanceModal
        isOpen={isMaintenanceOpen}
        onClose={() => setIsMaintenanceOpen(false)}
        onLeadSubmitted={(lead) => setConfirmedLead(lead)}
      />

      <InsuranceRescueModal
        isOpen={isInsuranceOpen}
        onClose={() => setIsInsuranceOpen(false)}
        onLeadSubmitted={(lead) => setConfirmedLead(lead)}
      />

      <AccessoriesModal
        isOpen={isAccessoriesOpen}
        onClose={() => setIsAccessoriesOpen(false)}
        onLeadSubmitted={(lead) => setConfirmedLead(lead)}
      />

      <RentalModal
        isOpen={isRentalOpen}
        onClose={() => setIsRentalOpen(false)}
        dealership={currentDealership}
        onLeadSubmitted={(lead) => setConfirmedLead(lead)}
      />

      <CarDetailModal
        car={detailCar}
        onClose={() => setDetailCar(null)}
        onOpenCalculator={handleOpenCalculatorForCar}
      />

      {/* Popup Xác Nhận Gửi Yêu Cầu Thành Công */}
      <LeadConfirmationModal
        lead={confirmedLead}
        onClose={() => setConfirmedLead(null)}
      />

      {/* Hệ Thống Đăng Nhập & Quản Trị Dữ Liệu Admin (chỉ trên trang VinFast 3S) */}
      <AdminLeadsModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
