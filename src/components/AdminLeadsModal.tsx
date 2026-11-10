import React, { useState, useEffect } from 'react';
import {
  CustomerLead,
  getStoredLeads,
  deleteLeadById,
  clearAllLeads,
  getGoogleSheetWebhookUrl,
  setGoogleSheetWebhookUrl,
  getTelegramConfig,
  setTelegramConfig,
  sendLeadToGoogleSheet,
  sendLeadToTelegram,
  saveStoredLeads,
  GOOGLE_APPS_SCRIPT_CODE
} from '../services/leadService';
import {
  X,
  Lock,
  Database,
  FileSpreadsheet,
  BellRing,
  Trash2,
  Download,
  RefreshCw,
  Copy,
  Check,
  LogOut,
  Search,
  Send
} from 'lucide-react';

interface AdminLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLeadsModal: React.FC<AdminLeadsModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'leads' | 'sheets' | 'notify'>('leads');
  const [leads, setLeads] = useState<CustomerLead[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [webhookStatus, setWebhookStatus] = useState<string>('');
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Telegram Notification Config
  const [telegramBotToken, setTelegramBotToken] = useState<string>('');
  const [telegramChatId, setTelegramChatId] = useState<string>('');
  const [telegramStatus, setTelegramStatus] = useState<string>('');
  const [isTestingTelegram, setIsTestingTelegram] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setLeads(getStoredLeads());
      setWebhookUrl(getGoogleSheetWebhookUrl());
      const tg = getTelegramConfig();
      setTelegramBotToken(tg.botToken);
      setTelegramChatId(tg.chatId);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'vinfast' && password === '123') {
      setIsAuthenticated(true);
      setLoginError('');
      setLeads(getStoredLeads());
    } else {
      setLoginError('Tài khoản hoặc mật khẩu không chính xác!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setLoginError('');
  };

  const handleDeleteLead = (id: string) => {
    const updated = deleteLeadById(id);
    setLeads(updated);
  };

  const handleClearAll = () => {
    clearAllLeads();
    setLeads([]);
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleSheetWebhookUrl(webhookUrl);
    setWebhookStatus('Đã lưu đường dẫn Google Sheets Web App thành công!');
    setTimeout(() => setWebhookStatus(''), 4000);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      setWebhookStatus('Vui lòng dán URL Web App Google Script trước khi bấm Gửi thử nghiệm.');
      return;
    }
    setGoogleSheetWebhookUrl(webhookUrl);
    setIsSyncing(true);
    const sampleLead: CustomerLead = {
      id: 'TEST-' + Date.now(),
      createdAt: new Date().toLocaleString('vi-VN'),
      customerName: 'Khách Hàng Thử Nghiệm',
      phone: '0912345678',
      category: 'Báo giá & Lăn bánh',
      carModel: 'VinFast VF 5',
      province: 'Bình Phước',
      licensePlate: '93A-888.88',
      details: 'Kiểm tra kết nối tự động đẩy dữ liệu từ Cổng thông tin VinFast 3S lên Google Sheets'
    };
    const ok = await sendLeadToGoogleSheet(sampleLead);
    setIsSyncing(false);
    if (ok) {
      setWebhookStatus('Đã gửi dòng dữ liệu thử nghiệm lên Google Sheets! Hãy mở trang tính của bạn để kiểm tra.');
    } else {
      setWebhookStatus('Không thể kết nối tới URL. Vui lòng kiểm tra lại URL Web App.');
    }
  };

  const handleSaveTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    setTelegramConfig({ botToken: telegramBotToken, chatId: telegramChatId });
    setTelegramStatus('Đã lưu cấu hình thông báo Telegram thành công!');
    setTimeout(() => setTelegramStatus(''), 4000);
  };

  const handleTestTelegram = async () => {
    if (!telegramBotToken.trim() || !telegramChatId.trim()) {
      setTelegramStatus('Vui lòng nhập đầy đủ Bot Token và Chat ID trước khi bấm Gửi thử nghiệm.');
      return;
    }
    setTelegramConfig({ botToken: telegramBotToken, chatId: telegramChatId });
    setIsTestingTelegram(true);
    const sampleLead: CustomerLead = {
      id: 'TEST-TG-' + Date.now(),
      createdAt: new Date().toLocaleString('vi-VN'),
      customerName: 'Nguyễn Văn A (Test)',
      phone: '0912345678',
      category: 'Đăng ký lái thử',
      carModel: 'VinFast VF 5',
      province: 'Bình Phước',
      details: 'Tin nhắn kiểm tra thông báo tự động về điện thoại từ VinFast 3S'
    };
    const ok = await sendLeadToTelegram(sampleLead);
    setIsTestingTelegram(false);
    if (ok) {
      setTelegramStatus('✅ Đã bắn tin nhắn thành công! Bạn hãy kiểm tra thông báo trên điện thoại nhé.');
    } else {
      setTelegramStatus('❌ Gửi chưa thành công. Vui lòng kiểm tra lại Bot Token, Chat ID và đảm bảo bạn đã bấm "Start" trong đoạn chat với Bot.');
    }
  };

  const handleSyncAllUnsynced = async () => {
    if (!getGoogleSheetWebhookUrl()) {
      setActiveTab('sheets');
      setWebhookStatus('Vui lòng cài đặt URL Google Sheets Web App tại đây trước khi đồng bộ.');
      return;
    }
    setIsSyncing(true);
    const updated = [...leads];
    for (let i = 0; i < updated.length; i++) {
      if (!updated[i].syncedToSheet) {
        const ok = await sendLeadToGoogleSheet(updated[i]);
        if (ok) {
          updated[i] = { ...updated[i], syncedToSheet: true };
        }
      }
    }
    saveStoredLeads(updated);
    setLeads(updated);
    setIsSyncing(false);
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      'Thời gian',
      'Họ và tên',
      'Số điện thoại',
      'Loại yêu cầu',
      'Dòng xe',
      'Biển số xe',
      'Tỉnh/Thành',
      'Chi tiết yêu cầu'
    ];
    const rows = leads.map((l) => [
      `"${l.createdAt}"`,
      `"${l.customerName.replace(/"/g, '""')}"`,
      `"'${l.phone}"`,
      `"${l.category}"`,
      `"${(l.carModel || '').replace(/"/g, '""')}"`,
      `"${(l.licensePlate || '').replace(/"/g, '""')}"`,
      `"${(l.province || '').replace(/"/g, '""')}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);
    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `du-lieu-khach-hang-vinfast-3s-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchCategory = selectedCategory === 'ALL' || lead.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchCategory;
    const matchText =
      lead.customerName.toLowerCase().includes(q) ||
      lead.phone.includes(q) ||
      (lead.carModel && lead.carModel.toLowerCase().includes(q)) ||
      (lead.licensePlate && lead.licensePlate.toLowerCase().includes(q)) ||
      lead.details.toLowerCase().includes(q);
    return matchCategory && matchText;
  });

  // 1. Giao diện Đăng nhập Admin
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white w-full max-w-sm rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1464F4] flex items-center justify-center">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Đăng Nhập Quản Trị Viên
                </h3>
                <p className="text-[11px] text-slate-500">Hệ thống dữ liệu khách hàng VinFast 3S</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
            >
              <X size={17} />
            </button>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-[11.5px] font-bold text-slate-700 uppercase mb-1.5">
                TÀI KHOẢN QUẢN TRỊ
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tài khoản..."
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-900 focus:border-[#1464F4] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11.5px] font-bold text-slate-700 uppercase mb-1.5">
                MẬT KHẨU
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-900 focus:border-[#1464F4] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl bg-[#1464F4] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Đăng Nhập Hệ Thống
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Giao diện Quản trị dữ liệu & Kết nối Google Sheets + Thông báo Điện thoại
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-5xl rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1464F4] flex items-center justify-center">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold">
                Hệ Thống Quản Trị Dữ Liệu Khách Hàng — VinFast 3S
              </h3>
              <p className="text-xs text-slate-300">
                Tổng số yêu cầu đã thu thập: <strong>{leads.length}</strong> khách hàng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Đăng xuất</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`pb-3 text-xs sm:text-sm font-extrabold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'leads'
                ? 'border-[#1464F4] text-[#1464F4]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database size={16} />
            <span>Danh Sách Khách Hàng ({leads.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notify')}
            className={`pb-3 text-xs sm:text-sm font-extrabold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'notify'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BellRing size={16} />
            <span>Báo Tinh Tinh Về Điện Thoại (Telegram / Gmail)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sheets')}
            className={`pb-3 text-xs sm:text-sm font-extrabold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'sheets'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet size={16} />
            <span>Kết Nối Google Sheets</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'leads' ? (
            <div className="space-y-4">
              {/* Filter & Action Toolbar */}
              <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
                <div className="flex flex-col sm:flex-row gap-2.5 flex-1">
                  <div className="relative flex-1">
                    <Search
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm theo tên, số điện thoại, dòng xe, biển số..."
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#1464F4] focus:outline-hidden"
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 focus:border-[#1464F4] focus:outline-hidden"
                  >
                    <option value="ALL">Tất cả danh mục ({leads.length})</option>
                    <option value="Báo giá & Lăn bánh">Báo giá & Lăn bánh</option>
                    <option value="Đăng ký lái thử">Đăng ký lái thử</option>
                    <option value="Thuê xe trải nghiệm">Thuê xe trải nghiệm</option>
                    <option value="Đặt lịch bảo dưỡng">Đặt lịch bảo dưỡng</option>
                    <option value="Sửa chữa & Đồng sơn">Sửa chữa & Đồng sơn</option>
                    <option value="Bảo hiểm & Cứu hộ">Bảo hiểm & Cứu hộ</option>
                    <option value="Linh kiện & Phụ kiện">Linh kiện & Phụ kiện</option>
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSyncAllUnsynced}
                    disabled={isSyncing || leads.length === 0}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                    <span>Đồng bộ Google Sheets</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    disabled={leads.length === 0}
                    className="px-3.5 py-2 rounded-xl bg-[#1464F4] hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Tải file Excel / CSV</span>
                  </button>

                  {leads.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                      <span>Xóa hết</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Leads Table */}
              {filteredLeads.length === 0 ? (
                <div className="py-14 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <Database size={32} className="mx-auto text-slate-300" />
                  <div className="text-sm font-bold text-slate-700">
                    Chưa có dữ liệu khách hàng nào
                  </div>
                  <p className="text-xs text-slate-500">
                    Khi khách hàng điền form trên Trang chủ VinFast 3S, dữ liệu sẽ hiển thị tại đây và tự động gửi về điện thoại & Google Sheets.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                        <th className="p-3 whitespace-nowrap">Thời gian</th>
                        <th className="p-3 whitespace-nowrap">Họ và tên</th>
                        <th className="p-3 whitespace-nowrap">Số điện thoại</th>
                        <th className="p-3 whitespace-nowrap">Loại yêu cầu</th>
                        <th className="p-3 whitespace-nowrap">Dòng xe / Biển số</th>
                        <th className="p-3">Chi tiết nội dung</th>
                        <th className="p-3 whitespace-nowrap text-center">Trạng thái</th>
                        <th className="p-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLeads.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80">
                          <td className="p-3 whitespace-nowrap text-slate-500 tabular-nums">
                            {item.createdAt}
                          </td>
                          <td className="p-3 font-extrabold text-slate-900 whitespace-nowrap">
                            {item.customerName}
                            {item.province && (
                              <span className="block text-[10.5px] font-normal text-slate-500">
                                {item.province}
                              </span>
                            )}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <a
                              href={`tel:${item.phone}`}
                              className="font-extrabold text-[#1464F4] hover:underline tabular-nums"
                            >
                              {item.phone}
                            </a>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#1464F4] font-bold text-[11px] border border-blue-200">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-3 whitespace-nowrap font-bold text-slate-800">
                            <div>{item.carModel || '-'}</div>
                            {item.licensePlate && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10.5px] font-extrabold">
                                {item.licensePlate}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-700 min-w-[220px] leading-relaxed">
                            {item.details}
                          </td>
                          <td className="p-3 whitespace-nowrap text-center space-y-1">
                            {item.syncedToSheet && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 mr-1">
                                <Check size={10} /> Sheet
                              </span>
                            )}
                            {item.notifiedTelegram && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#1464F4] font-bold text-[10px] border border-blue-200">
                                <Check size={10} /> Telegram
                              </span>
                            )}
                            {!item.syncedToSheet && !item.notifiedTelegram && (
                              <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium text-[10.5px]">
                                Lưu tại web
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleDeleteLead(item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Xóa dòng này"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeTab === 'notify' ? (
            /* TAB 2: Thông báo tức thì về điện thoại (Telegram & Gmail) */
            <div className="space-y-6">
              {/* Cách 1: Telegram Bot (Bắn thông báo trong 1 giây) */}
              <form
                onSubmit={handleSaveTelegram}
                className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-4"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-blue-950 flex items-center gap-2">
                      <span>📲 Cách 1: Nhận Thông Báo Tức Thì Qua Ứng Dụng Telegram (Khuyên dùng)</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Ngay khi khách bấm Xác nhận, tin nhắn kèm Họ tên + SĐT sẽ đổ chuông trên điện thoại của bạn trong 1 giây (Hoàn toàn miễn phí).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      1. TELEGRAM BOT TOKEN
                    </label>
                    <input
                      type="text"
                      value={telegramBotToken}
                      onChange={(e) => setTelegramBotToken(e.target.value)}
                      placeholder="Ví dụ: 7123456789:AAH..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-blue-300 bg-white text-xs sm:text-sm text-slate-800 focus:border-[#1464F4] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      2. TELEGRAM CHAT ID CỦA BẠN
                    </label>
                    <input
                      type="text"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      placeholder="Ví dụ: 123456789"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-blue-300 bg-white text-xs sm:text-sm text-slate-800 focus:border-[#1464F4] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#1464F4] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    Lưu Cấu Hình Telegram
                  </button>
                  <button
                    type="button"
                    onClick={handleTestTelegram}
                    disabled={isTestingTelegram}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-blue-100 border border-blue-300 text-[#1464F4] font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send size={14} />
                    <span>{isTestingTelegram ? 'Đang gửi...' : 'Bắn Thử Thông Báo Về Điện Thoại'}</span>
                  </button>
                </div>

                {telegramStatus && (
                  <div className="p-3 rounded-xl bg-white border border-blue-200 text-xs font-bold text-slate-800">
                    {telegramStatus}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="font-extrabold text-[#1464F4]">Cách lấy Bot Token (30 giây):</div>
                    <p>
                      Mở ứng dụng <strong>Telegram</strong> trên điện thoại, tìm <strong>@BotFather</strong> → nhắn <code>/newbot</code> → đặt tên bất kỳ → BotFather sẽ cấp cho bạn dãy <strong>Token</strong>. Nhớ bấm vào link con Bot vừa tạo và bấm nút <strong>Start (Bắt đầu)</strong>.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                    <div className="font-extrabold text-[#1464F4]">Cách lấy Chat ID của bạn (10 giây):</div>
                    <p>
                      Trên Telegram, tìm <strong>@userinfobot</strong> rồi bấm <strong>Start</strong> → nó sẽ hiện ngay con số <strong>Id</strong> (ví dụ: <code>543216789</code>). Copy số đó dán vào ô <strong>Chat ID</strong> ở trên là xong!
                    </p>
                  </div>
                </div>
              </form>

              {/* Cách 2: Thông báo qua ứng dụng Gmail trên điện thoại */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs sm:text-sm">
                <h4 className="font-extrabold text-emerald-950">
                  📧 Cách 2: Nhận Thông Báo Qua Ứng Dụng Gmail Trên Điện Thoại (Tự Động Kèm Google Sheets)
                </h4>
                <p className="text-slate-700 leading-relaxed text-xs">
                  Trong đoạn mã <strong>Google Apps Script</strong> ở tab <em>"Kết Nối Google Sheets"</em>, hệ thống đã tích hợp sẵn lệnh <code>MailApp.sendEmail("minhhien241097@gmail.com", ...)</code>. Mỗi khi khách gửi form, Google Sheets không chỉ tự động ghi dòng mới mà còn <strong>bắn ngay 1 thông báo đẩy về ứng dụng Gmail trên điện thoại</strong> của bạn!
                </p>
              </div>
            </div>
          ) : (
            /* TAB 3: Kết nối & Hướng dẫn Google Sheets */
            <div className="space-y-6">
              {/* Khung dán URL Webhook */}
              <form
                onSubmit={handleSaveWebhook}
                className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs sm:text-sm font-extrabold text-emerald-950 flex items-center gap-2">
                    <FileSpreadsheet size={18} className="text-emerald-600" />
                    <span>Đường dẫn Web App URL của Google Sheets (Apps Script):</span>
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    Tự động lưu vào Sheet & bắn thông báo Gmail về điện thoại
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-xs sm:text-sm text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
                  >
                    Lưu Đường Dẫn
                  </button>
                  <button
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={isSyncing}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Send size={14} />
                    <span>Gửi Thử Nghiệm</span>
                  </button>
                </div>

                {webhookStatus && (
                  <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-800">
                    {webhookStatus}
                  </div>
                )}
              </form>

              {/* Hướng dẫn từng bước */}
              <div className="space-y-4">
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                  📋 Hướng Dẫn 3 Bước Kết Nối Tự Động Với Google Sheets & Báo Về Điện Thoại
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="font-extrabold text-[#1464F4] text-sm">
                      Bước 1: Mở Apps Script trong Google Sheets
                    </div>
                    <p className="text-slate-600">
                      1. Tạo một file <strong>Google Trang tính (Google Sheets)</strong> mới.
                      <br />
                      2. Trên thanh menu của Google Sheets, bấm vào <strong>Tiện ích mở rộng (Extensions)</strong> → chọn <strong>Apps Script</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="font-extrabold text-[#1464F4] text-sm">
                      Bước 2: Dán đoạn mã nhận dữ liệu
                    </div>
                    <p className="text-slate-600">
                      1. Xóa đoạn mã mặc định trong cửa sổ Apps Script rồi <strong>dán toàn bộ đoạn mã bên dưới</strong> vào.
                      <br />
                      2. Bấm biểu tượng <strong>Lưu (💾 Ctrl + S)</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="font-extrabold text-[#1464F4] text-sm">
                      Bước 3: Triển khai & Lấy link Web App
                    </div>
                    <p className="text-slate-600">
                      1. Bấm nút <strong>Triển khai (Deploy)</strong> ở góc phải trên → <strong>Tùy chọn triển khai mới (New deployment)</strong>.
                      <br />
                      2. Chọn loại: <strong>Ứng dụng web (Web app)</strong>.
                      <br />
                      3. Phần <em>Ai có quyền truy cập (Who has access)</em>: Chọn <strong>Bất kỳ ai (Anyone)</strong> → bấm <strong>Triển khai</strong> → Copy <strong>URL ứng dụng web</strong> dán vào ô phía trên!
                    </p>
                  </div>
                </div>

                {/* Khung code Apps Script */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-800 text-white flex items-center justify-between">
                    <span className="text-xs font-bold">
                      Mã Google Apps Script (Đã bỏ cột Mã ID & Tích hợp bắn thông báo Gmail về điện thoại)
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyScript}
                      className="px-3 py-1 rounded-lg bg-[#1464F4] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedScript ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedScript ? 'Đã sao chép mã!' : 'Sao chép mã Script'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-900 text-emerald-300 text-[11px] overflow-x-auto leading-relaxed font-mono">
                    {GOOGLE_APPS_SCRIPT_CODE}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
