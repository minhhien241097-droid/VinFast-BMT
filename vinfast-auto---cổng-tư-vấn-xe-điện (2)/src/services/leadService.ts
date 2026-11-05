export interface LeadData {
  id: string;
  type: 'test_drive' | 'quote' | 'rental' | 'accessories';
  typeName: string;
  fullName: string;
  phone: string;
  carName: string;
  versionName?: string;
  price?: number;
  locationType?: string;
  city?: string;
  address?: string;
  preferredDate?: string;
  timeSlot?: string;
  paymentType?: string;
  note?: string;
  createdAt: string;
}

export interface WebhookConfig {
  googleSheetUrl: string;
  telegramBotToken: string;
  telegramChatId: string;
  autoSendTelegram: boolean;
  autoSendGoogleSheet: boolean;
}

const SETTINGS_KEY = 'vinfast_webhook_settings';
const LEADS_KEY = 'vinfast_leads_store';

export const DEFAULT_GOOGLE_SHEET_URL =
  'https://script.google.com/macros/s/AKfycbww9SZ6fwScD5unuLAhutLrbFHGYH7kCYarrwDyUqycJIOt11ZXtysHevJCmXtHF8cReg/exec';

export const getWebhookConfig = (): WebhookConfig => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        googleSheetUrl: parsed.googleSheetUrl || DEFAULT_GOOGLE_SHEET_URL
      };
    }
  } catch {
    // fallback
  }
  return {
    googleSheetUrl: DEFAULT_GOOGLE_SHEET_URL,
    telegramBotToken: '',
    telegramChatId: '',
    autoSendTelegram: true,
    autoSendGoogleSheet: true
  };
};

export const saveWebhookConfig = (config: WebhookConfig): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving webhook config', e);
  }
};

export const getAllLeads = (): LeadData[] => {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return [];
};

export const clearAllLeads = (): void => {
  try {
    localStorage.removeItem(LEADS_KEY);
    localStorage.removeItem('vinfast_test_drives');
    localStorage.removeItem('vinfast_quotes');
  } catch (e) {
    console.error('Error clearing leads', e);
  }
};

// Dispatch lead to Google Sheet via Google Apps Script Web App
export const sendToGoogleSheet = async (lead: LeadData, webhookUrl?: string): Promise<{ success: boolean; message: string }> => {
  const url = webhookUrl || getWebhookConfig().googleSheetUrl;
  if (!url) {
    return { success: false, message: 'Chưa cấu hình link Google Apps Script' };
  }

  try {
    // Mode no-cors with text/plain is standard and 100% reliable for Google Apps Script Web App redirects
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(lead)
    });
    return { success: true, message: 'Đã gửi dữ liệu sang Google Sheet thành công' };
  } catch (err) {
    console.error('Lỗi gửi Google Sheet:', err);
    return { success: false, message: 'Không thể kết nối đến Google Sheet URL' };
  }
};

// Dispatch notification to Telegram Bot
export const sendToTelegram = async (lead: LeadData, botToken?: string, chatId?: string): Promise<{ success: boolean; message: string }> => {
  const token = botToken || getWebhookConfig().telegramBotToken;
  const chat = chatId || getWebhookConfig().telegramChatId;

  if (!token || !chat) {
    return { success: false, message: 'Chưa cấu hình Telegram Bot Token hoặc Chat ID' };
  }

  const messageText = `🚗 <b>KHÁCH HÀNG MỚI TỪ WEBSITE VINFAST</b>\n` +
    `---------------------------------------\n` +
    `📌 <b>Nhu cầu:</b> ${lead.typeName}\n` +
    `👤 <b>Họ tên:</b> <b>${lead.fullName}</b>\n` +
    `📞 <b>Điện thoại:</b> <code>${lead.phone}</code> (<a href="tel:${lead.phone}">Gọi ngay</a>)\n` +
    `🚘 <b>Mẫu xe:</b> <b>${lead.carName}</b> ${lead.versionName ? `(${lead.versionName})` : ''}\n` +
    (lead.price ? `💰 <b>Giá xe:</b> ${lead.price.toLocaleString('vi-VN')} đ\n` : '') +
    (lead.locationType ? `📍 <b>Hình thức:</b> ${lead.locationType}\n` : '') +
    (lead.city ? `🏙 <b>Khu vực:</b> ${lead.city}\n` : '') +
    (lead.address ? `🏠 <b>Địa chỉ:</b> ${lead.address}\n` : '') +
    (lead.preferredDate ? `📅 <b>Ngày hẹn:</b> ${lead.preferredDate} (${lead.timeSlot || 'Trong ngày'})\n` : '') +
    (lead.paymentType ? `💳 <b>Hình thức thanh toán:</b> ${lead.paymentType}\n` : '') +
    (lead.note ? `📝 <b>Ghi chú:</b> <i>${lead.note}</i>\n` : '') +
    `⏰ <b>Thời gian:</b> ${new Date(lead.createdAt).toLocaleString('vi-VN')}\n` +
    `---------------------------------------\n` +
    `⚡ <i>Vui lòng liên hệ hỗ trợ khách hàng trong vòng 10 phút!</i>`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chat,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const data = await res.json();
    if (data.ok) {
      return { success: true, message: 'Đã bắn tin nhắn đến Telegram thành công' };
    } else {
      return { success: false, message: data.description || 'Lỗi gửi tin nhắn Telegram' };
    }
  } catch (err) {
    console.error('Lỗi gửi Telegram:', err);
    return { success: false, message: 'Lỗi mạng khi kết nối máy chủ Telegram' };
  }
};

// Main function to record and distribute a lead across all channels
export const submitLead = async (leadInput: Omit<LeadData, 'id' | 'createdAt'>): Promise<{ success: boolean; lead: LeadData }> => {
  const lead: LeadData = {
    ...leadInput,
    id: 'LEAD_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString()
  };

  // 1. Luôn lưu vào LocalStorage để không bao giờ mất dữ liệu
  try {
    const existing = getAllLeads();
    existing.unshift(lead);
    localStorage.setItem(LEADS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Lỗi lưu lead vào localStorage', e);
  }

  const config = getWebhookConfig();

  // 2. Tự động gửi tới Google Sheet nếu có link cấu hình
  if (config.autoSendGoogleSheet && config.googleSheetUrl) {
    sendToGoogleSheet(lead, config.googleSheetUrl).catch((err) => {
      console.warn('Google Sheet background send issue:', err);
    });
  }

  // 3. Tự động gửi tới Telegram nếu có token và chat ID
  if (config.autoSendTelegram && config.telegramBotToken && config.telegramChatId) {
    sendToTelegram(lead, config.telegramBotToken, config.telegramChatId).catch((err) => {
      console.warn('Telegram background send issue:', err);
    });
  }

  return { success: true, lead };
};

// Helper: Xuất danh sách Lead thành file CSV (tương thích 100% Microsoft Excel tiếng Việt UTF-8 BOM)
export const exportLeadsToCSV = (leads: LeadData[]): void => {
  if (!leads || leads.length === 0) return;

  const headers = [
    'Mã Lead',
    'Thời Gian',
    'Họ Và Tên',
    'Số Điện Thoại',
    'Loại Yêu Cầu',
    'Dòng Xe',
    'Phiên Bản',
    'Giá Xe (VNĐ)',
    'Hình Thức',
    'Tỉnh/Thành Phố',
    'Địa Chỉ',
    'Ngày Hẹn',
    'Khung Giờ',
    'Hình Thức Mua',
    'Ghi Chú'
  ];

  const escapeCSV = (str: string | number | undefined) => {
    if (str === undefined || str === null) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = leads.map((l) => [
    escapeCSV(l.id),
    escapeCSV(new Date(l.createdAt).toLocaleString('vi-VN')),
    escapeCSV(l.fullName),
    escapeCSV(l.phone),
    escapeCSV(l.typeName),
    escapeCSV(l.carName),
    escapeCSV(l.versionName || ''),
    escapeCSV(l.price || ''),
    escapeCSV(l.locationType || ''),
    escapeCSV(l.city || ''),
    escapeCSV(l.address || ''),
    escapeCSV(l.preferredDate || ''),
    escapeCSV(l.timeSlot || ''),
    escapeCSV(l.paymentType || ''),
    escapeCSV(l.note || '')
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `danh_sach_khach_hang_vinfast_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
