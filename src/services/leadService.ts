export type LeadCategory =
  | 'Báo giá & Lăn bánh'
  | 'Đăng ký lái thử'
  | 'Thuê xe trải nghiệm'
  | 'Đặt lịch bảo dưỡng'
  | 'Sửa chữa & Đồng sơn'
  | 'Bảo hiểm & Cứu hộ'
  | 'Linh kiện & Phụ kiện';

export interface CustomerLead {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  category: LeadCategory;
  carModel: string;
  details: string;
  province?: string;
  licensePlate?: string;
  syncedToSheet?: boolean;
  notifiedTelegram?: boolean;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

const LEADS_STORAGE_KEY = 'vinfast_3s_customer_leads_v1';
const SHEET_WEBHOOK_STORAGE_KEY = 'vinfast_3s_google_sheet_webhook_v1';
const TELEGRAM_CONFIG_STORAGE_KEY = 'vinfast_3s_telegram_config_v1';

/**
 * Kiểm tra số điện thoại hợp lệ: bắt buộc đúng 10 chữ số và bắt đầu bằng số 0
 */
export const cleanPhoneDigits = (raw: string): string => {
  return raw.replace(/[\s.-]/g, '').trim();
};

export const isValidVietnamPhone = (raw: string): boolean => {
  const cleaned = cleanPhoneDigits(raw);
  return /^0\d{9}$/.test(cleaned);
};

export const PHONE_VALIDATION_ERROR =
  'Số điện thoại bắt buộc phải gồm đúng 10 chữ số và bắt đầu bằng số 0 (ví dụ: 0912345678).';

export const getGoogleSheetWebhookUrl = (): string => {
  try {
    const saved = localStorage.getItem(SHEET_WEBHOOK_STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch {
    // ignore storage errors
  }
  return (import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL as string) || '';
};

export const setGoogleSheetWebhookUrl = (url: string): void => {
  try {
    localStorage.setItem(SHEET_WEBHOOK_STORAGE_KEY, url.trim());
  } catch {
    // ignore storage errors
  }
};

export const getTelegramConfig = (): TelegramConfig => {
  try {
    const raw = localStorage.getItem(TELEGRAM_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        botToken: (parsed.botToken || '').trim(),
        chatId: (parsed.chatId || '').trim()
      };
    }
  } catch {
    // ignore storage errors
  }
  return { botToken: '', chatId: '' };
};

export const setTelegramConfig = (config: TelegramConfig): void => {
  try {
    localStorage.setItem(
      TELEGRAM_CONFIG_STORAGE_KEY,
      JSON.stringify({
        botToken: config.botToken.trim(),
        chatId: config.chatId.trim()
      })
    );
  } catch {
    // ignore storage errors
  }
};

export const getStoredLeads = (): CustomerLead[] => {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveStoredLeads = (leads: CustomerLead[]): void => {
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch {
    // ignore storage errors
  }
};

export const sendLeadToGoogleSheet = async (lead: CustomerLead): Promise<boolean> => {
  const webhookUrl = getGoogleSheetWebhookUrl();
  if (!webhookUrl) return false;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(lead)
    });
    return true;
  } catch {
    return false;
  }
};

/**
 * Gửi thông báo đẩy tức thì về điện thoại qua ứng dụng Telegram
 */
export const sendLeadToTelegram = async (lead: CustomerLead): Promise<boolean> => {
  const { botToken, chatId } = getTelegramConfig();
  if (!botToken || !chatId) return false;

  const messageLines = [
    `🔔 *KHÁCH HÀNG MỚI — VINFAST 3S*`,
    `━━━━━━━━━━━━━━━━━━`,
    `👤 *Khách hàng:* ${lead.customerName}`,
    `📞 *Số điện thoại:* ${lead.phone}`,
    `📌 *Nhu cầu:* ${lead.category}`,
    lead.carModel ? `🚘 *Dòng xe:* ${lead.carModel}` : '',
    lead.licensePlate ? `🔢 *Biển số:* ${lead.licensePlate}` : '',
    lead.province ? `📍 *Khu vực:* ${lead.province}` : '',
    `📝 *Chi tiết:* ${lead.details}`,
    `⏰ *Thời gian:* ${lead.createdAt}`
  ].filter(Boolean);

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageLines.join('\n'),
        parse_mode: 'Markdown'
      })
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const submitCustomerLead = async (
  input: Omit<CustomerLead, 'id' | 'createdAt' | 'syncedToSheet' | 'notifiedTelegram'>
): Promise<CustomerLead> => {
  const cleanedPhone = cleanPhoneDigits(input.phone);
  const newLead: CustomerLead = {
    ...input,
    phone: cleanedPhone,
    id: 'LEAD-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    createdAt: new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }),
    syncedToSheet: false,
    notifiedTelegram: false
  };

  const existing = getStoredLeads();
  saveStoredLeads([newLead, ...existing]);

  const [syncedSheet, sentTelegram] = await Promise.all([
    sendLeadToGoogleSheet(newLead),
    sendLeadToTelegram(newLead)
  ]);

  if (syncedSheet || sentTelegram) {
    newLead.syncedToSheet = syncedSheet;
    newLead.notifiedTelegram = sentTelegram;
    saveStoredLeads([newLead, ...existing]);
  }

  return newLead;
};

export const deleteLeadById = (id: string): CustomerLead[] => {
  const filtered = getStoredLeads().filter((item) => item.id !== id);
  saveStoredLeads(filtered);
  return filtered;
};

export const clearAllLeads = (): void => {
  saveStoredLeads([]);
};

export const GOOGLE_APPS_SCRIPT_CODE = `// Điền email của bạn vào đây để nhận thông báo đẩy về điện thoại qua ứng dụng Gmail:
var NOTIFY_EMAIL = "minhhien241097@gmail.com";

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Tự động tạo dòng tiêu đề nếu trang tính đang trống (đã lược bỏ cột Mã ID cho gọn)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời gian",
        "Họ và tên",
        "Số điện thoại",
        "Loại yêu cầu",
        "Dòng xe",
        "Biển số xe",
        "Tỉnh / Thành",
        "Chi tiết yêu cầu"
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold");
    }

    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.createdAt || new Date().toLocaleString("vi-VN"),
      data.customerName || "",
      "'" + (data.phone || ""),
      data.category || "",
      data.carModel || "",
      data.licensePlate || "",
      data.province || "",
      data.details || ""
    ]);

    // Tự động bắn thông báo về điện thoại qua Gmail ngay lập tức
    if (NOTIFY_EMAIL && NOTIFY_EMAIL.indexOf("@") !== -1) {
      var subject = "🔔 [VinFast 3S] Khách mới: " + (data.customerName || "") + " - " + (data.phone || "");
      var body =
        "Hệ thống VinFast 3S vừa nhận được yêu cầu mới:\\n\\n" +
        "• Họ và tên: " + (data.customerName || "") + "\\n" +
        "• Số điện thoại: " + (data.phone || "") + "\\n" +
        "• Nhu cầu: " + (data.category || "") + "\\n" +
        "• Dòng xe: " + (data.carModel || "") + "\\n" +
        (data.licensePlate ? "• Biển số xe: " + data.licensePlate + "\\n" : "") +
        (data.province ? "• Tỉnh/Thành: " + data.province + "\\n" : "") +
        "• Chi tiết: " + (data.details || "") + "\\n" +
        "• Thời gian: " + (data.createdAt || "");
      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}`;
