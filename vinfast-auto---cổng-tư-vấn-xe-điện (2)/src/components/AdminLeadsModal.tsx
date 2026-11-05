import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Download,
  Trash2,
  FileSpreadsheet,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Phone,
  Search,
  Filter,
  RefreshCw,
  PlusCircle,
  Lock,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import {
  LeadData,
  WebhookConfig,
  getAllLeads,
  clearAllLeads,
  getWebhookConfig,
  saveWebhookConfig,
  sendToGoogleSheet,
  sendToTelegram,
  exportLeadsToCSV,
  submitLead
} from '../services/leadService';

interface AdminLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GOOGLE_APPS_SCRIPT_SAMPLE = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Nếu trang tính chưa có tiêu đề cột, tự động tạo dòng tiêu đề
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời Gian",
        "Họ Và Tên",
        "Số Điện Thoại",
        "Nhu Cầu",
        "Dòng Xe",
        "Phiên Bản",
        "Hình Thức",
        "Tỉnh / Thành Phố",
        "Địa Chỉ",
        "Ngày Hẹn",
        "Khung Giờ",
        "Phương Thức Thanh Toán",
        "Ghi Chú"
      ]);
      sheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#1464F4").setFontColor("#FFFFFF");
    }

    var data = JSON.parse(e.postData.contents);
    
    // Thêm dòng dữ liệu khách hàng mới
    sheet.appendRow([
      new Date().toLocaleString("vi-VN"),
      data.fullName || "",
      data.phone || "",
      data.typeName || "",
      data.carName || "",
      data.versionName || "",
      data.locationType || "",
      data.city || "",
      data.address || "",
      data.preferredDate || "",
      data.timeSlot || "",
      data.paymentType || "",
      data.note || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

export const AdminLeadsModal: React.FC<AdminLeadsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'sheet' | 'telegram'>('leads');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [leads, setLeads] = useState<LeadData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [config, setConfig] = useState<WebhookConfig>(getWebhookConfig());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<{ message: string; isError?: boolean } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLeads(getAllLeads());
      setConfig(getWebhookConfig());
      setTestStatus(null);
      setAuthError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername.trim() === 'admin5' && adminPassword === '54321') {
      setIsAuthenticated(true);
      setAuthError('');
      setAdminPassword('');
    } else {
      setAuthError('Tài khoản hoặc mật khẩu không chính xác! Vui lòng thử lại.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminUsername('');
    setAdminPassword('');
    setAuthError('');
  };

  const handleRefreshLeads = () => {
    setLeads(getAllLeads());
  };

  const handleClearData = () => {
    if (window.confirm('Bạn có chắc chắn muốn xoá toàn bộ data khách hàng lưu trữ tạm trên trình duyệt này?')) {
      clearAllLeads();
      setLeads([]);
    }
  };

  const handleSaveConfig = () => {
    saveWebhookConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_SAMPLE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCreateMockLead = async () => {
    await submitLead({
      type: 'test_drive',
      typeName: 'Đăng Ký Lái Thử',
      fullName: 'Nguyễn Văn Minh (Khách Thử Nghiệm)',
      phone: '0988123456',
      carName: 'VinFast VF 3',
      versionName: 'VF 3 Plus',
      locationType: 'Lái thử tận nhà',
      city: 'Bình Phước',
      address: 'Phường Tân Phú, TP. Đồng Xoài',
      preferredDate: '2026-11-05',
      timeSlot: '09:00 - 11:00',
      note: 'Muốn lái thử xem độ cách âm và leo dốc'
    });
    setLeads(getAllLeads());
  };

  const handleTestGoogleSheet = async () => {
    if (!config.googleSheetUrl) {
      setTestStatus({ message: 'Vui lòng dán Webhook URL của Google Sheets trước khi kiểm tra!', isError: true });
      return;
    }
    setIsTesting(true);
    setTestStatus(null);
    try {
      const mockLead: LeadData = {
        id: 'TEST_' + Date.now(),
        type: 'test_drive',
        typeName: 'KIỂM TRA KẾT NỐI (TEST)',
        fullName: 'Nguyễn Văn Thử Nghiệm',
        phone: '0909123456',
        carName: 'VinFast VF 7',
        versionName: 'VF 7 Plus',
        locationType: 'Lái thử tận nhà',
        city: 'Bình Phước',
        address: '123 Đường Phú Riềng Đỏ',
        createdAt: new Date().toISOString(),
        note: 'Tin nhắn gửi thử nghiệm từ trang quản trị VinFast'
      };
      await sendToGoogleSheet(mockLead, config.googleSheetUrl);
      setTestStatus({ message: 'Đã gửi lệnh thử nghiệm! Hãy mở Google Sheets của bạn để xem dòng mới xuất hiện.' });
    } catch (e) {
      setTestStatus({ message: 'Không thể kết nối với Webhook URL: ' + String(e), isError: true });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestTelegram = async () => {
    if (!config.telegramBotToken || !config.telegramChatId) {
      setTestStatus({ message: 'Vui lòng điền đầy đủ Bot Token và Chat ID trước khi kiểm tra!', isError: true });
      return;
    }
    setIsTesting(true);
    setTestStatus(null);
    try {
      const mockLead: LeadData = {
        id: 'TEST_' + Date.now(),
        type: 'quote',
        typeName: 'KIỂM TRA KẾT NỐI TELEGRAM (TEST)',
        fullName: 'Trần Thị Thu (Khách Test)',
        phone: '0912345678',
        carName: 'VinFast VF 6',
        versionName: 'VF 6 Plus',
        price: 699000000,
        city: 'Bình Phước',
        createdAt: new Date().toISOString(),
        note: 'Tin nhắn kiểm tra chuông điện thoại bot Telegram hoạt động tốt!'
      };
      const res = await sendToTelegram(mockLead, config.telegramBotToken, config.telegramChatId);
      if (res.success) {
        setTestStatus({ message: 'Tuyệt vời! Bot Telegram đã gửi tin nhắn thành công. Hãy kiểm tra ứng dụng Telegram của bạn!' });
      } else {
        setTestStatus({ message: 'Lỗi từ Telegram API: ' + res.message, isError: true });
      }
    } catch (e) {
      setTestStatus({ message: 'Lỗi kết nối Telegram: ' + String(e), isError: true });
    } finally {
      setIsTesting(false);
    }
  };

  const filteredLeads = leads.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      item.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.city && item.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-[#3B82F6] border border-blue-400/30 flex items-center justify-center">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  Đăng Nhập Quản Trị Hệ Thống
                </h3>
                <p className="text-xs text-slate-300">
                  Khu vực bảo mật nội bộ VinFast
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-slate-700/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 font-semibold">
                <AlertCircle size={16} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tài khoản quản trị
              </label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Nhập tài khoản quản trị"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1464F4] text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1464F4] text-sm font-medium"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#1464F4] hover:bg-[#0f4ec2] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={18} />
                Đăng Nhập Quản Trị
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400 pt-1">
              Thông tin bảo mật dành cho quản lý showroom
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-4xl rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-[#3B82F6] border border-blue-400/30 flex items-center justify-center text-xl font-bold">
              <Database size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Trung Tâm Dữ Liệu Khách Hàng & Webhook Tự Động
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Real-time Sync
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Lưu trữ khách hàng, xuất file Excel và tự động đẩy dữ liệu về Google Sheets & Telegram
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
            >
              <LogOut size={14} />
              <span>Đăng xuất</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-slate-700/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'leads'
                ? 'border-[#1464F4] text-[#1464F4]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database size={15} />
            <span>Danh Sách Khách Hàng ({leads.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sheet')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'sheet'
                ? 'border-[#1464F4] text-[#1464F4]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet size={15} />
            <span>1. Tích Hợp Google Sheet</span>
            {config.googleSheetUrl && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('telegram')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'telegram'
                ? 'border-[#1464F4] text-[#1464F4]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send size={15} />
            <span>2. Tích Hợp Telegram Bot</span>
            {config.telegramBotToken && config.telegramChatId && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: DANH SÁCH LEADS */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1 max-w-xs">
                    <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên, SĐT, xe..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#1464F4]"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#1464F4]"
                    >
                      <option value="all">Tất cả nhu cầu</option>
                      <option value="test_drive">Đăng ký lái thử</option>
                      <option value="quote">Yêu cầu báo giá</option>
                      <option value="rental">Thuê xe điện</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRefreshLeads}
                    className="p-2 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors title='Làm mới'"
                  >
                    <RefreshCw size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => exportLeadsToCSV(leads)}
                    disabled={leads.length === 0}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download size={14} />
                    <span>Xuất file Excel / CSV</span>
                  </button>

                  {leads.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearData}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
                      title="Xoá lịch sử"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {filteredLeads.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto text-xl">
                    📁
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">
                    Chưa có khách hàng nào được ghi nhận
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Khi khách hàng bấm &quot;Đăng Ký Lái Thử&quot; hoặc &quot;Nhận Báo Giá&quot; trên website, thông tin sẽ lập tức hiện tại đây và tự động chuyển về Google Sheet & Telegram của bạn.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleCreateMockLead}
                      className="px-4 py-2 bg-blue-50 text-[#1464F4] hover:bg-blue-100 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 border border-blue-200"
                    >
                      <PlusCircle size={14} />
                      <span>Tạo dữ liệu khách thử nghiệm mẫu</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Thời gian</th>
                        <th className="p-3">Họ và tên</th>
                        <th className="p-3">Số điện thoại</th>
                        <th className="p-3">Nhu cầu</th>
                        <th className="p-3">Dòng xe</th>
                        <th className="p-3">Khu vực / Địa chỉ</th>
                        <th className="p-3">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLeads.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                          <td className="p-3 text-slate-500 whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            <div className="text-[10px] text-slate-400">
                              {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                          </td>
                          <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                            {item.fullName}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <a
                              href={`tel:${item.phone}`}
                              className="font-bold text-[#1464F4] hover:underline flex items-center gap-1"
                            >
                              <Phone size={12} />
                              <span>{item.phone}</span>
                            </a>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              item.type === 'test_drive'
                                ? 'bg-amber-100 text-amber-800'
                                : item.type === 'quote'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {item.typeName}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">
                            {item.carName} {item.versionName ? `(${item.versionName})` : ''}
                          </td>
                          <td className="p-3 text-slate-600 max-w-[180px] truncate" title={`${item.address ? item.address + ', ' : ''}${item.city || ''}`}>
                            {item.address ? `${item.address}, ` : ''}{item.city || 'Chưa cập nhật'}
                          </td>
                          <td className="p-3 text-slate-500 max-w-[200px] truncate" title={item.note || ''}>
                            {item.note || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CẤU HÌNH GOOGLE SHEETS */}
          {activeTab === 'sheet' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <FileSpreadsheet className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                <div className="text-xs text-emerald-950 space-y-1">
                  <div className="font-bold text-sm">Cơ chế hoạt động của Google Sheets</div>
                  <p>
                    Khi khách gửi form, website sẽ tự động bắn 1 dòng mới vào Google Sheet của bạn qua <strong>Google Apps Script Web App</strong>. File Google Sheet sẽ tự động lưu trữ vĩnh viễn, xem được trên điện thoại và chia sẻ cho toàn bộ phòng kinh doanh.
                  </p>
                </div>
              </div>

              {/* Input URL */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Google Apps Script Web App URL (Liên kết Webhook):
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    value={config.googleSheetUrl}
                    onChange={(e) => setConfig({ ...config, googleSheetUrl: e.target.value.trim() })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:border-[#1464F4] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    className="px-4 py-2 bg-[#1464F4] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={handleTestGoogleSheet}
                    disabled={isTesting}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    {isTesting ? 'Đang gửi...' : 'Gửi Thử Nghiệm'}
                  </button>
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Đã lưu cấu hình Google Sheets thành công!</span>
                </div>
              )}

              {testStatus && (
                <div className={`p-3 text-xs font-bold rounded-xl flex items-center gap-2 ${
                  testStatus.isError ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {testStatus.isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                  <span>{testStatus.message}</span>
                </div>
              )}

              {/* Hướng dẫn tạo Google Sheet */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Hướng dẫn 1 phút tạo Google Sheet nhận data:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Copy size={13} />
                    <span>{copiedCode ? 'Đã sao chép!' : 'Copy mã Google Apps Script'}</span>
                  </button>
                </div>

                <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl text-xs font-mono max-h-48 overflow-y-auto leading-relaxed">
                  <pre>{GOOGLE_APPS_SCRIPT_SAMPLE}</pre>
                </div>

                <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <li>Truy cập <a href="https://sheets.google.com" target="_blank" rel="noreferrer" className="text-[#1464F4] font-bold underline inline-flex items-center gap-0.5">sheets.google.com <ExternalLink size={11} /></a> và tạo 1 trang tính mới (Đặt tên: <i>VinFast - Khách Hàng Website</i>).</li>
                  <li>Trên thanh menu, bấm <strong>Tiện ích mở rộng (Extensions)</strong> &rarr; Chọn <strong>Apps Script</strong>.</li>
                  <li>Xoá hết code cũ trong ô soạn thảo, bấm nút <strong>&quot;Copy mã Google Apps Script&quot;</strong> ở trên và dán vào.</li>
                  <li>Bấm nút <strong>Triển khai (Deploy)</strong> màu xanh góc phải trên cùng &rarr; Chọn <strong>Triển khai mới (New deployment)</strong>.</li>
                  <li>Chọn loại: <strong>Ứng dụng web (Web app)</strong>.</li>
                  <li>Tại mục <i>&quot;Ai có quyền truy cập (Who has access)&quot;</i>: Chọn <strong>&quot;Bất kỳ ai (Anyone)&quot;</strong> &rarr; Bấm <strong>Triển khai (Deploy)</strong>.</li>
                  <li>Copy liên kết <strong>URL ứng dụng web (Web app URL)</strong> và dán vào ô nhập ở trên &rarr; Bấm <strong>Lưu</strong> và <strong>Gửi Thử Nghiệm</strong>!</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: CẤU HÌNH TELEGRAM BOT */}
          {activeTab === 'telegram' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
                <Send className="text-[#1464F4] shrink-0 mt-0.5" size={20} />
                <div className="text-xs text-blue-950 space-y-1">
                  <div className="font-bold text-sm">Cơ chế thông báo tức thì qua Telegram</div>
                  <p>
                    Ngay khi khách hàng điền số điện thoại và gửi yêu cầu, bot Telegram sẽ <strong>ngay lập tức gửi thông báo đẩy đến điện thoại của bạn</strong> hoặc nhóm chat của Showroom. Sale chỉ cần bấm số điện thoại trên Telegram là gọi được ngay cho khách.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Telegram Bot Token:
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 7123456789:AAHk..."
                    value={config.telegramBotToken}
                    onChange={(e) => setConfig({ ...config, telegramBotToken: e.target.value.trim() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:border-[#1464F4] focus:bg-white"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Lấy miễn phí từ @BotFather trên Telegram
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Telegram Chat ID (hoặc Group ID):
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 123456789 hoặc -1001987654321"
                    value={config.telegramChatId}
                    onChange={(e) => setConfig({ ...config, telegramChatId: e.target.value.trim() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:border-[#1464F4] focus:bg-white"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    ID cá nhân hoặc ID nhóm Telegram của showroom
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-5 py-2.5 bg-[#1464F4] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 size={15} />
                  <span>Lưu Cấu Hình Telegram</span>
                </button>
                <button
                  type="button"
                  onClick={handleTestTelegram}
                  disabled={isTesting}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Send size={15} />
                  <span>{isTesting ? 'Đang gửi...' : 'Bắn Tin Nhắn Thử Về Điện Thoại'}</span>
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Đã lưu cấu hình Telegram thành công!</span>
                </div>
              )}

              {testStatus && (
                <div className={`p-3 text-xs font-bold rounded-xl flex items-center gap-2 ${
                  testStatus.isError ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {testStatus.isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                  <span>{testStatus.message}</span>
                </div>
              )}

              {/* Hướng dẫn lấy Token & Chat ID */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Các bước tạo Bot Telegram nhận thông báo:
                </span>
                <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <li>Mở ứng dụng Telegram, tìm kiếm <strong>@BotFather</strong> và bấm <strong>Start</strong>.</li>
                  <li>Gửi lệnh <code>/newbot</code>, sau đó đặt tên cho bot (ví dụ: <i>VinFast Binh Phuoc Lead Bot</i>) và username kết thúc bằng <code>_bot</code>.</li>
                  <li>@BotFather sẽ gửi cho bạn <strong>HTTP API token</strong> &rarr; copy dán vào ô <strong>Telegram Bot Token</strong> ở trên.</li>
                  <li>Để lấy <strong>Chat ID</strong>: Tìm kiếm bot <strong>@userinfobot</strong> hoặc thêm bot vừa tạo vào nhóm Telegram của showroom rồi gửi 1 tin nhắn bất kỳ, sau đó vào link <code>https://api.telegram.org/bot&lt;TOKEN&gt;/getUpdates</code> để xem <code>&quot;chat&quot;:&#123;&quot;id&quot;:...&#125;</code>.</li>
                  <li>Dán Chat ID vào ô trên, bấm <strong>Lưu</strong> và <strong>Bắn Tin Nhắn Thử Về Điện Thoại</strong>!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Hệ thống tự động đồng bộ thời gian thực 24/7.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
