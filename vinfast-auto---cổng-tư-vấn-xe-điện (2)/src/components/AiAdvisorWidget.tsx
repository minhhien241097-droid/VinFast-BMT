import React, { useState, useRef, useEffect } from 'react';
import { VINFAST_CARS, DEALERSHIP_INFO } from '../data/cars';
import { CarModel } from '../types';
import { submitLead } from '../services/leadService';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Calculator,
  Car,
  Phone,
  MessageSquare,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Gift,
  Scale
} from 'lucide-react';

interface AiAdvisorWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectCarDetail: (car: CarModel) => void;
  onOpenCalculatorForCar: (car: CarModel) => void;
  onOpenTestDriveForCar: (car: CarModel) => void;
  onOpenQuoteForCar: (car: CarModel) => void;
  onShowToast: (msg: string) => void;
}

interface QuickReply {
  label: string;
  action: string;
}

interface ComparisonData {
  carA: CarModel;
  carB: CarModel;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  cars?: CarModel[];
  comparison?: ComparisonData;
  quickReplies?: QuickReply[];
  showLeadForm?: boolean;
  preselectedCarName?: string;
}

const DEFAULT_QUICK_REPLIES: QuickReply[] = [
  { label: '💰 Tư vấn theo tầm tiền', action: 'PROMPT_BUDGET' },
  { label: '🚗 Chọn xe theo nhu cầu', action: 'PROMPT_NEED' },
  { label: '🏦 Tính trả góp & Trả trước', action: 'PROMPT_INSTALLMENT' },
  { label: '⚖️ So sánh 2 dòng xe', action: 'PROMPT_COMPARE' },
  { label: '🎁 Ưu đãi & Bảo hành', action: 'PROMPT_PROMO' },
  { label: '📅 Đăng ký lái thử tận nhà', action: 'PROMPT_TEST_DRIVE' }
];

const formatCurrency = (val: number) => {
  return val.toLocaleString('vi-VN') + ' đ';
};

const formatMillion = (val: number) => {
  if (val >= 1000000000) {
    const billions = (val / 1000000000).toFixed(2).replace(/\.?0+$/, '');
    return `${billions} tỷ`;
  }
  return `${Math.round(val / 1000000)} triệu`;
};

// Normalize Vietnamese text for smart keyword matching
const normalizeVi = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');

export const AiAdvisorWidget: React.FC<AiAdvisorWidgetProps> = ({
  isOpen,
  onToggle,
  onSelectCarDetail,
  onOpenCalculatorForCar,
  onOpenTestDriveForCar,
  onOpenQuoteForCar,
  onShowToast
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Xin chào Quý khách! 👋 Em là Trợ lý AI Tư vấn 24/7 của ${DEALERSHIP_INFO.showroomName} (Đại lý ${DEALERSHIP_INFO.tier} Chính hãng).\n\nEm có thể giúp anh/chị tính giá lăn bánh, trả góp ngân hàng, so sánh thông số xe hoặc tìm mẫu xe phù hợp nhất với tầm tài chính. Anh/chị đang quan tâm nội dung nào ạ?`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      quickReplies: DEFAULT_QUICK_REPLIES
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Mini inline lead form states
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCar, setLeadCar] = useState('VinFast VF 3');
  const [leadSubmittedIds, setLeadSubmittedIds] = useState<Record<string, boolean>>({});
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const findMentionedCars = (query: string): CarModel[] => {
    const q = normalizeVi(query);
    const matched: CarModel[] = [];

    const rules: { id: string; keywords: string[] }[] = [
      { id: 'vf2', keywords: ['vf2', 'vf 2'] },
      { id: 'vf3', keywords: ['vf3', 'vf 3'] },
      { id: 'vf5', keywords: ['vf5', 'vf 5'] },
      { id: 'vf6', keywords: ['vf6', 'vf 6'] },
      { id: 'vf7', keywords: ['vf7', 'vf 7'] },
      { id: 'vf8', keywords: ['vf8', 'vf 8'] },
      { id: 'vf9', keywords: ['vf9', 'vf 9'] },
      { id: 'vfwild', keywords: ['wild', 'vf wild', 'ban tai'] },
      { id: 'lachong900lx', keywords: ['lac hong', '900 lx', '900lx'] },
      { id: 'miniogreen', keywords: ['minio', 'minio green'] },
      { id: 'ecvan', keywords: ['ec van', 'ecvan', 'tai van', 'xe van'] },
      { id: 'limogreen', keywords: ['limo', 'limo green'] }
    ];

    for (const rule of rules) {
      if (rule.keywords.some((kw) => q.includes(kw))) {
        const car = VINFAST_CARS.find((c) => c.id === rule.id);
        if (car && !matched.some((m) => m.id === car.id)) {
          matched.push(car);
        }
      }
    }

    return matched;
  };

  const buildCarLoanSummary = (car: CarModel): string => {
    const downPayment20 = Math.round(car.price * 0.2);
    const regPlateEstimate = 2381000; // Phí biển số + đường bộ + đăng kiểm + BH TNDS bắt buộc tại tỉnh
    const totalUpfront = downPayment20 + regPlateEstimate;
    return (
      `📌 **Dự toán trả góp ${car.name}** (Miễn 100% lệ phí trước bạ):\n` +
      `• Giá niêm yết: **${formatCurrency(car.price)}**\n` +
      `• Trả trước 20% giá xe: **~${formatMillion(downPayment20)}**\n` +
      `• Tổng tiền chuẩn bị lăn bánh (gồm biển số, đăng kiểm): **~${formatMillion(totalUpfront)}**\n` +
      `• Góp hàng tháng dự kiến: **~${formatCurrency(car.monthlyInstallmentEstimate)}/tháng**\n` +
      `• Quãng đường: **${car.rangeText}** | Số chỗ: **${car.seatsDisplay}**`
    );
  };

  const generateBotReply = (userText: string, actionCode?: string): Omit<ChatMessage, 'id' | 'sender' | 'timestamp'> => {
    const q = normalizeVi(userText);

    // 1. Check if user typed a phone number directly in chat
    const phoneMatch = userText.replace(/[\s.-]/g, '').match(/(0[35789]\d{8})/);
    if (phoneMatch && !actionCode) {
      const detectedPhone = phoneMatch[1];
      const mentioned = findMentionedCars(userText);
      const carLabel = mentioned.length > 0 ? mentioned[0].name : 'Tư vấn qua Trợ lý AI';

      submitLead({
        type: 'quote',
        typeName: 'Khách để lại SĐT trên Chat AI',
        fullName: 'Khách hàng Chat AI',
        phone: detectedPhone,
        carName: carLabel,
        note: `Tin nhắn khách gửi: "${userText}"`
      });

      onShowToast(`Đã ghi nhận SĐT ${detectedPhone}! Chuyên viên sẽ liên hệ ngay.`);

      return {
        text: `Dạ em đã ghi nhận số điện thoại **${detectedPhone}** của anh/chị vào hệ thống ưu tiên của **${DEALERSHIP_INFO.showroomName}**! 🎉\n\nChuyên viên tư vấn sẽ liên hệ hoặc nhắn Zalo gửi bảng tính lăn bánh chi tiết trong ít phút nữa. Nếu cần gấp, anh/chị có thể bấm gọi trực tiếp Hotline **${DEALERSHIP_INFO.hotline}** nhé!`,
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    // 2. Handle structured Quick Actions
    if (actionCode === 'PROMPT_BUDGET') {
      return {
        text: 'Dạ anh/chị đang dự kiến tầm tài chính mua xe (hoặc số tiền trả trước) khoảng bao nhiêu để em lọc mẫu xe phù hợp nhất ạ?',
        quickReplies: [
          { label: '💵 Trả trước 50 - 90 triệu', action: 'BUDGET_DOWN_LOW' },
          { label: '💰 Dưới 300 triệu (Mua thẳng)', action: 'BUDGET_UNDER_300' },
          { label: '💰 Từ 450 - 700 triệu', action: 'BUDGET_450_700' },
          { label: '💰 Từ 700 triệu - 1,2 tỷ', action: 'BUDGET_700_1200' },
          { label: '👑 Trên 1,2 tỷ (Cao cấp)', action: 'BUDGET_OVER_1200' }
        ]
      };
    }

    if (actionCode === 'BUDGET_DOWN_LOW' || actionCode === 'BUDGET_UNDER_300') {
      const cars = VINFAST_CARS.filter((c) => ['vf2', 'vf3', 'ecvan', 'miniogreen'].includes(c.id));
      return {
        text: 'Với tầm tài chính tiết kiệm (hoặc **trả trước chỉ từ 45 – 70 triệu đồng** khi vay ngân hàng 80%), đây là các dòng xe đô thị & kinh doanh cực kỳ kinh tế, miễn 100% lệ phí trước bạ:',
        cars,
        quickReplies: [
          { label: '⚖️ So sánh VF 3 và VF 2', action: 'COMPARE_vf3_vf2' },
          { label: '🏦 Tính trả góp VF 3', action: 'LOAN_vf3' },
          { label: '📩 Nhận báo giá qua Zalo', action: 'OPEN_LEAD_FORM' },
          { label: '🔙 Menu chính', action: 'MAIN_MENU' }
        ]
      };
    }

    if (actionCode === 'BUDGET_450_700') {
      const cars = VINFAST_CARS.filter((c) => ['vf5', 'vf6', 'limogreen'].includes(c.id));
      return {
        text: 'Trong phân khúc **450 – 700 triệu đồng** (trả trước từ **100 – 150 triệu**), anh/chị có các lựa chọn SUV 5 chỗ gia đình và MPV 7 chỗ cực kỳ rộng rãi, trang bị ngập tràn công nghệ:',
        cars,
        quickReplies: [
          { label: '⚖️ So sánh VF 5 và VF 6', action: 'COMPARE_vf5_vf6' },
          { label: '🏦 Tính trả góp VF 5', action: 'LOAN_vf5' },
          { label: '🏦 Tính trả góp VF 6', action: 'LOAN_vf6' },
          { label: '📩 Nhận báo giá qua Zalo', action: 'OPEN_LEAD_FORM' }
        ]
      };
    }

    if (actionCode === 'BUDGET_700_1200') {
      const cars = VINFAST_CARS.filter((c) => ['vf7', 'vf8', 'vfwild'].includes(c.id));
      return {
        text: 'Trong tầm giá **700 triệu – 1,2 tỷ đồng**, đây là 3 mẫu SUV & Bán tải hạng C-D mạnh mẽ, sang trọng và bán chạy hàng đầu tại VinFast Bình Phước:',
        cars,
        quickReplies: [
          { label: '⚖️ So sánh VF 7 và VF 8', action: 'COMPARE_vf7_vf8' },
          { label: '⚖️ So sánh VF 8 và VF Wild', action: 'COMPARE_vf8_vfwild' },
          { label: '🏦 Tính trả góp VF 8', action: 'LOAN_vf8' },
          { label: '📩 Nhận báo giá qua Zalo', action: 'OPEN_LEAD_FORM' }
        ]
      };
    }

    if (actionCode === 'BUDGET_OVER_1200') {
      const cars = VINFAST_CARS.filter((c) => ['vf9', 'lachong900lx'].includes(c.id));
      return {
        text: 'Dành cho phân khúc **Chủ tịch & Gia đình thượng lưu**, VinFast sở hữu SUV 7 chỗ Full-size **VF 9** và tuyệt tác siêu sang **Lạc Hồng 900 LX**:',
        cars,
        quickReplies: [
          { label: '🏦 Tính trả góp VF 9', action: 'LOAN_vf9' },
          { label: '📅 Đặt lịch lái thử VIP', action: 'PROMPT_TEST_DRIVE' },
          { label: '🔙 Menu chính', action: 'MAIN_MENU' }
        ]
      };
    }

    if (actionCode === 'PROMPT_NEED') {
      return {
        text: 'Anh/chị đang tìm mua xe phục vụ mục đích chính nào dưới đây ạ?',
        quickReplies: [
          { label: '🏙️ Đi phố nhỏ gọn, đưa đón con', action: 'NEED_CITY' },
          { label: '👨‍👩‍👧 Gia đình 5 chỗ gầm cao', action: 'NEED_FAMILY_5' },
          { label: '👨‍👩‍👧‍👦 Gia đình 7 chỗ rộng rãi', action: 'NEED_FAMILY_7' },
          { label: '🛻 Bán tải đi địa hình & công trình', action: 'NEED_PICKUP' },
          { label: '🚕 Chạy dịch vụ / Chở hàng kinh tế', action: 'NEED_SERVICE' }
        ]
      };
    }

    if (actionCode === 'NEED_CITY') {
      const cars = VINFAST_CARS.filter((c) => ['vf3', 'vf2', 'vf5'].includes(c.id));
      return {
        text: 'Để đi lại trong phố, đưa đón con đi học và che mưa che nắng an toàn, **VF 3**, **VF 2** và **VF 5** là 3 mẫu xe linh hoạt nhất, quay đầu dễ dàng và chi phí sạc điện chỉ vài trăm nghìn mỗi tháng:',
        cars,
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    if (actionCode === 'NEED_FAMILY_5') {
      const cars = VINFAST_CARS.filter((c) => ['vf5', 'vf6', 'vf7', 'vf8'].includes(c.id));
      return {
        text: 'Dành cho **gia đình 5 chỗ gầm cao**, VinFast có đầy đủ từ cỡ A-SUV đến D-SUV với hệ thống trợ lái thông minh ADAS và cốp rộng:',
        cars,
        quickReplies: [
          { label: '⚖️ So sánh VF 6 và VF 7', action: 'COMPARE_vf6_vf7' },
          { label: '⚖️ So sánh VF 7 và VF 8', action: 'COMPARE_vf7_vf8' },
          { label: '🔙 Menu chính', action: 'MAIN_MENU' }
        ]
      };
    }

    if (actionCode === 'NEED_FAMILY_7') {
      const cars = VINFAST_CARS.filter((c) => ['limogreen', 'vf9'].includes(c.id));
      return {
        text: 'Nếu gia đình đông người cần **7 chỗ ngồi thực thụ (3 hàng ghế rộng rãi)**, anh/chị có thể chọn **Limo Green** (699 triệu - siêu tiết kiệm) hoặc **VF 9** (SUV hạng E Full-size đẳng cấp):',
        cars,
        quickReplies: [
          { label: '⚖️ So sánh Limo Green và VF 9', action: 'COMPARE_limogreen_vf9' },
          { label: '📩 Nhận báo giá lăn bánh', action: 'OPEN_LEAD_FORM' },
          { label: '🔙 Menu chính', action: 'MAIN_MENU' }
        ]
      };
    }

    if (actionCode === 'NEED_PICKUP') {
      const wild = VINFAST_CARS.find((c) => c.id === 'vfwild');
      return {
        text: 'Với nhu cầu bán tải đa dụng, **VinFast VF Wild** là mẫu bán tải cỡ trung đột phá ứng dụng công nghệ mở rộng quãng đường **REEV (kết hợp xăng + điện)** cho tầm vận hành hỗn hợp **hơn 1.000 km**, không lo trạm sạc khi đi rừng hay công trình xa!',
        cars: wild ? [wild] : [],
        quickReplies: [
          { label: '🏦 Dự toán trả góp VF Wild', action: 'LOAN_vfwild' },
          { label: '📩 Đặt chỗ nhận ưu đãi sớm', action: 'OPEN_LEAD_FORM' },
          { label: '🔙 Menu chính', action: 'MAIN_MENU' }
        ]
      };
    }

    if (actionCode === 'NEED_SERVICE') {
      const cars = VINFAST_CARS.filter((c) => ['miniogreen', 'vf5', 'limogreen', 'ecvan'].includes(c.id));
      return {
        text: 'Dành cho anh/chị mua xe **chạy dịch vụ Xanh SM, chạy hợp đồng hoặc chở hàng nội đô**, đây là các dòng xe tối ưu chi phí vận hành (chỉ ~200đ - 400đ/km), thu hồi vốn cực nhanh:',
        cars,
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    if (actionCode === 'PROMPT_INSTALLMENT') {
      return {
        text: 'Hiện tại Đại lý VinFast 3S Bình Phước hỗ trợ **vay trả góp lên đến 80% giá trị xe** trong tối đa **8 năm (96 tháng)**, thủ tục duyệt hồ sơ nhanh trong ngày.\n\nAnh/chị bấm chọn dòng xe bên dưới để xem ngay số tiền trả trước 20% và tiền góp mỗi tháng nhé:',
        quickReplies: [
          { label: '🏦 Trả góp VF 3', action: 'LOAN_vf3' },
          { label: '🏦 Trả góp VF 5', action: 'LOAN_vf5' },
          { label: '🏦 Trả góp VF 6', action: 'LOAN_vf6' },
          { label: '🏦 Trả góp VF 7', action: 'LOAN_vf7' },
          { label: '🏦 Trả góp VF 8', action: 'LOAN_vf8' },
          { label: '🏦 Trả góp VF Wild', action: 'LOAN_vfwild' },
          { label: '🏦 Trả góp Limo Green', action: 'LOAN_limogreen' }
        ]
      };
    }

    if (actionCode && actionCode.startsWith('LOAN_')) {
      const carId = actionCode.replace('LOAN_', '');
      const car = VINFAST_CARS.find((c) => c.id === carId);
      if (car) {
        return {
          text: buildCarLoanSummary(car),
          cars: [car],
          quickReplies: [
            { label: '📩 Gửi bảng tính chi tiết qua Zalo', action: 'OPEN_LEAD_FORM' },
            { label: '🏦 Xem trả góp mẫu xe khác', action: 'PROMPT_INSTALLMENT' },
            { label: '🔙 Menu chính', action: 'MAIN_MENU' }
          ]
        };
      }
    }

    if (actionCode === 'PROMPT_COMPARE') {
      return {
        text: 'Anh/chị có thể **bấm chọn cặp xe phổ biến bên dưới** hoặc **gõ trực tiếp tên 2 xe bất kỳ** vào ô chat (ví dụ: *"So sánh VF 5 và VF 6"* hoặc *"VF 8 với VF Wild"*) để em lập bảng đối chiếu ngay nhé:',
        quickReplies: [
          { label: '⚖️ VF 3 vs VF 2', action: 'COMPARE_vf3_vf2' },
          { label: '⚖️ VF 3 vs VF 5', action: 'COMPARE_vf3_vf5' },
          { label: '⚖️ VF 5 vs VF 6', action: 'COMPARE_vf5_vf6' },
          { label: '⚖️ VF 6 vs VF 7', action: 'COMPARE_vf6_vf7' },
          { label: '⚖️ VF 7 vs VF 8', action: 'COMPARE_vf7_vf8' },
          { label: '⚖️ VF 8 vs VF Wild', action: 'COMPARE_vf8_vfwild' }
        ]
      };
    }

    if (actionCode && actionCode.startsWith('COMPARE_')) {
      const parts = actionCode.replace('COMPARE_', '').split('_');
      const carA = VINFAST_CARS.find((c) => c.id === parts[0]);
      const carB = VINFAST_CARS.find((c) => c.id === parts[1]);
      if (carA && carB) {
        return {
          text: `Bảng so sánh nhanh giữa **${carA.name}** và **${carB.name}**:`,
          comparison: { carA, carB },
          quickReplies: [
            { label: '⚖️ So sánh cặp xe khác', action: 'PROMPT_COMPARE' },
            { label: '📩 Nhận báo giá lăn bánh', action: 'OPEN_LEAD_FORM' },
            { label: '🔙 Menu chính', action: 'MAIN_MENU' }
          ]
        };
      }
    }

    if (actionCode === 'PROMPT_PROMO') {
      return {
        text:
          `🎁 **Chính sách & Ưu đãi đặc quyền tại ${DEALERSHIP_INFO.showroomName} (Đại lý 3S):**\n\n` +
          `✅ **Miễn 100% lệ phí trước bạ** theo chính sách nhà nước cho ô tô điện (tiết kiệm từ 20 đến hơn 150 triệu đồng).\n` +
          `✅ **Ưu đãi sạc pin** tại hệ thống trạm sạc V-GREEN phủ rộng 63 tỉnh thành.\n` +
          `✅ **Bảo hành chính hãng dài nhất thị trường:** Bảo hành xe lên tới 7 – 10 năm, cứu hộ 24/7 miễn phí.\n` +
          `✅ **Hỗ trợ vay ngân hàng tới 80%**, lãi suất ưu đãi, bao hồ sơ tỉnh.\n` +
          `✅ **Lái thử tận nhà & Giao xe tận nơi** tại Bình Phước, Đồng Nai và các tỉnh lân cận.\n\n` +
          `Anh/chị để lại SĐT bên dưới để nhận báo giá lăn bánh kèm quà tặng phụ kiện mới nhất trong tháng nhé!`,
        showLeadForm: true,
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    if (actionCode === 'PROMPT_TEST_DRIVE' || actionCode === 'OPEN_LEAD_FORM') {
      return {
        text: `Dạ anh/chị điền nhanh **Họ tên + Số điện thoại** vào khung bên dưới, chuyên viên **${DEALERSHIP_INFO.showroomName}** sẽ gửi ngay bảng tính lăn bánh qua Zalo hoặc sắp xếp mang xe đến tận nhà để anh/chị lái thử miễn phí ạ:`,
        showLeadForm: true,
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    if (actionCode === 'MAIN_MENU') {
      return {
        text: 'Dạ em gửi lại danh mục hỗ trợ nhanh, anh/chị cần xem mục nào cứ bấm chọn hoặc gõ câu hỏi cho em nhé:',
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    // 3. Free-text Natural Language Understanding (NLP)
    const mentionedCars = findMentionedCars(userText);

    // 3a. Check if user is asking for a discount / bargaining / special policy / hard question
    const isBargainingOrSpecialPolicy =
      q.includes('giam gia') ||
      q.includes('giam them') ||
      q.includes('bot gia') ||
      q.includes('bot khong') ||
      q.includes('bot duoc') ||
      q.includes('bot them') ||
      q.includes('chiet khau') ||
      q.includes('gia net') ||
      q.includes('gia tot nhat') ||
      q.includes('thuong luong') ||
      q.includes('dat qua') ||
      q.includes('mac qua') ||
      q.includes('thu cu') ||
      q.includes('doi moi') ||
      q.includes('no xau') ||
      q.includes('no chu y') ||
      q.includes('ton kho') ||
      q.includes('co san xe') ||
      q.includes('giao ngay');

    if (isBargainingOrSpecialPolicy) {
      const targetCar = mentionedCars.length > 0 ? mentionedCars[0] : undefined;
      return {
        text:
          `Dạ về mức xin giảm giá thêm, chiết khấu tiền mặt hoặc chính sách hỗ trợ riêng này hiện tại em chưa nắm được dữ liệu trên hệ thống tự động ạ (do mức ưu đãi kịch sàn cần Quản lý Đại lý phê duyệt trực tiếp theo từng thời điểm lấy xe). 🙏\n\n` +
          `Anh/chị vui lòng để lại **Tên và Số điện thoại** ngay bên dưới nha, chuyên viên bán hàng của **${DEALERSHIP_INFO.showroomName}** sẽ liên hệ lại ngay để báo mức giá tốt nhất và giải đáp chi tiết cho anh/chị ạ!`,
        cars: targetCar ? [targetCar] : undefined,
        showLeadForm: true,
        preselectedCarName: targetCar?.name,
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    // 3b. Check if user is asking about deep/unlisted features or complex technical questions
    const isDeepUnknownQuestion =
      q.includes('camera hanh trinh') ||
      q.includes('phuoc') ||
      q.includes('he thong treo') ||
      q.includes('am thanh') ||
      q.includes('may loa') ||
      q.includes('dan phim') ||
      q.includes('phu gam') ||
      q.includes('do xe') ||
      q.includes('loi ') ||
      q.includes('hay hong') ||
      q.includes('bao duong') ||
      q.includes('thay pin') ||
      q.includes('thue pin') ||
      q.includes('phu tung') ||
      q.includes('hop tac xa') ||
      q.includes('bien vang') ||
      q.includes('ap suat lop') ||
      q.includes('phan mem');

    if (isDeepUnknownQuestion) {
      const targetCar = mentionedCars.length > 0 ? mentionedCars[0] : undefined;
      return {
        text:
          `Dạ về thông tin chuyên sâu này hiện tại em chưa có dữ liệu chi tiết trên hệ thống nên chưa dám trả lời chính xác ngay cho anh/chị ạ. 🙏\n\n` +
          `Anh/chị vui lòng để lại **Tên và Số điện thoại** ở khung bên dưới giúp em nhé, chuyên viên bán hàng của **${DEALERSHIP_INFO.showroomName}** nắm rõ thực tế xe sẽ liên hệ lại giải đáp tường tận cho anh/chị ngay ạ!`,
        cars: targetCar ? [targetCar] : undefined,
        showLeadForm: true,
        preselectedCarName: targetCar?.name,
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    // If user mentions 2 cars -> Auto Compare!
    if (mentionedCars.length >= 2) {
      return {
        text: `Em gửi anh/chị bảng so sánh chi tiết giữa **${mentionedCars[0].name}** và **${mentionedCars[1].name}**:`,
        comparison: { carA: mentionedCars[0], carB: mentionedCars[1] },
        quickReplies: [
          { label: `🏦 Tính trả góp ${mentionedCars[0].name}`, action: `LOAN_${mentionedCars[0].id}` },
          { label: `🏦 Tính trả góp ${mentionedCars[1].name}`, action: `LOAN_${mentionedCars[1].id}` },
          { label: '📩 Nhận báo giá 2 xe qua Zalo', action: 'OPEN_LEAD_FORM' }
        ]
      };
    }

    // If user mentions 1 specific car
    if (mentionedCars.length === 1) {
      const car = mentionedCars[0];
      const isAskingLoan =
        q.includes('tra gop') ||
        q.includes('vay') ||
        q.includes('tra truoc') ||
        q.includes('moi thang') ||
        q.includes('hang thang') ||
        q.includes('lan banh');

      if (isAskingLoan) {
        return {
          text: buildCarLoanSummary(car),
          cars: [car],
          showLeadForm: true,
          preselectedCarName: car.name,
          quickReplies: DEFAULT_QUICK_REPLIES
        };
      }

      const versionsText = car.versionPrices
        .map((v) => `• ${v.name}: **${formatCurrency(v.price)}**`)
        .join('\n');

      return {
        text:
          `🚘 **Thông tin & Giá niêm yết ${car.name}:**\n` +
          `${versionsText}\n\n` +
          `• Phân khúc: **${car.segment}** (${car.seatsDisplay})\n` +
          `• Tầm vận hành: **${car.rangeText}**\n` +
          `• Công suất: **${car.horsepower} Hp** | Sạc nhanh: **${car.chargingTimeFast}**\n` +
          `• Bảo hành xe: **${car.warrantyCar}**\n` +
          `• Trả góp dự kiến: **Chỉ từ ${formatCurrency(car.monthlyInstallmentEstimate)}/tháng** (Trả trước ~${formatMillion(Math.round(car.price * 0.2))})`,
        cars: [car],
        quickReplies: [
          { label: `🏦 Tính trả góp ${car.name}`, action: `LOAN_${car.id}` },
          { label: '📩 Nhận báo giá lăn bánh Zalo', action: 'OPEN_LEAD_FORM' },
          { label: '⚖️ So sánh với xe khác', action: 'PROMPT_COMPARE' },
          { label: '🔙 Menu chính', action: 'MAIN_MENU' }
        ]
      };
    }

    // Check budget numbers in free text (e.g. "300 triệu", "500tr", "dưới 600")
    const millionMatch = q.match(/(\d+)\s*(trieu|tr\b|cu\b)/);
    if (millionMatch) {
      const amountMillion = parseInt(millionMatch[1], 10);
      if (amountMillion <= 180) {
        // Likely asking about down payment (trả trước)
        const maxCarPrice = amountMillion * 5 * 1000000;
        const matchedByDown = VINFAST_CARS.filter((c) => c.price <= maxCarPrice + 80000000).slice(0, 4);
        return {
          text: `Với số tiền trả trước khoảng **${amountMillion} triệu đồng** (tương đương trả trước 20% khi vay ngân hàng), anh/chị hoàn toàn có thể sở hữu ngay các dòng xe dưới đây:`,
          cars: matchedByDown,
          quickReplies: DEFAULT_QUICK_REPLIES
        };
      } else {
        const targetVnd = amountMillion * 1000000;
        const matchedByPrice = VINFAST_CARS.filter(
          (c) => c.price <= targetVnd + 120000000 && c.price >= targetVnd - 250000000
        );
        const resultCars = matchedByPrice.length > 0 ? matchedByPrice : VINFAST_CARS.slice(0, 3);
        return {
          text: `Với tầm ngân sách khoảng **${amountMillion} triệu đồng**, em gợi ý các mẫu xe VinFast phù hợp nhất (đang được miễn 100% lệ phí trước bạ):`,
          cars: resultCars,
          quickReplies: DEFAULT_QUICK_REPLIES
        };
      }
    }

    // Check general topics
    if (q.includes('tra gop') || q.includes('ngan hang') || q.includes('lai suat') || q.includes('tra truoc')) {
      return generateBotReply(userText, 'PROMPT_INSTALLMENT');
    }

    if (q.includes('so sanh') || q.includes('khac nhau') || q.includes('nen mua')) {
      return generateBotReply(userText, 'PROMPT_COMPARE');
    }

    if (q.includes('khuyen mai') || q.includes('uu dai') || q.includes('truoc ba') || q.includes('qua tang')) {
      return generateBotReply(userText, 'PROMPT_PROMO');
    }

    if (q.includes('lai thu') || q.includes('xem xe') || q.includes('dia chi') || q.includes('showroom') || q.includes('o dau')) {
      return {
        text:
          `📍 **Hệ thống Showroom ${DEALERSHIP_INFO.showroomName} (Đại lý ${DEALERSHIP_INFO.tier}):**\n` +
          `• **CN Đồng Xoài:** 525 Phú Riềng Đỏ, P. Bình Phước, TP. Đồng Nai (Bình Phước).\n` +
          `• **CN Đồng Phú:** KCN Bắc Đồng Phú, P. Đồng Phú, TP. Đồng Nai (Bình Phước).\n` +
          `• **Hotline / Zalo 24/7:** **${DEALERSHIP_INFO.hotline}**\n\n` +
          `Đặc biệt, đại lý có dịch vụ **mang xe đến tận nhà cho khách hàng lái thử miễn phí**. Anh/chị để lại thông tin bên dưới để em xếp lịch xe nhé!`,
        showLeadForm: true,
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    if (q.includes('7 cho')) {
      return generateBotReply(userText, 'NEED_FAMILY_7');
    }

    if (q.includes('5 cho') || q.includes('gia dinh')) {
      return generateBotReply(userText, 'NEED_FAMILY_5');
    }

    if (q.includes('dich vu') || q.includes('xanh sm') || q.includes('taxi') || q.includes('cho hang')) {
      return generateBotReply(userText, 'NEED_SERVICE');
    }

    if (q === 'xin chao' || q === 'chao' || q === 'hi' || q === 'hello' || q === 'alo') {
      return {
        text: `Dạ **${DEALERSHIP_INFO.showroomName}** xin chào anh/chị ạ! 👋 Anh/chị đang quan tâm dòng xe nào hay cần tính giá lăn bánh, trả góp cứ nhắn em hỗ trợ ngay nhé!`,
        quickReplies: DEFAULT_QUICK_REPLIES
      };
    }

    // Default fallback for unknown / difficult questions -> Politely admit and ask for contact info & phone number
    return {
      text:
        `Dạ về câu hỏi/thông tin này hiện tại hệ thống tự động của em chưa có dữ liệu chi tiết nên em chưa giải đáp chính xác ngay cho anh/chị được ạ. 🙏\n\n` +
        `Anh/chị vui lòng để lại **Tên và Số điện thoại** ở khung bên dưới nha, chuyên viên bán hàng của **${DEALERSHIP_INFO.showroomName}** sẽ liên hệ lại ngay để tư vấn và giải đáp cụ thể cho anh/chị nhé!`,
      showLeadForm: true,
      quickReplies: DEFAULT_QUICK_REPLIES
    };
  };

  const handleUserAction = (displayText: string, actionCode?: string) => {
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: displayText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Thời gian trả lời tự nhiên từ 3.2 giây đến 4.8 giây (3 - 5s)
    const naturalDelayMs = Math.floor(Math.random() * 1600) + 3200;

    setTimeout(() => {
      const replyData = generateBotReply(displayText, actionCode);
      if (replyData.preselectedCarName) {
        setLeadCar(replyData.preselectedCarName);
      }
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        ...replyData
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, naturalDelayMs);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setInputValue('');
    handleUserAction(trimmed);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'bot',
        text: `Xin chào Quý khách! 👋 Em là Trợ lý AI Tư vấn 24/7 của ${DEALERSHIP_INFO.showroomName}.\nAnh/chị cần tính giá lăn bánh, trả góp hay so sánh dòng xe nào cứ chọn bên dưới nhé!`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        quickReplies: DEFAULT_QUICK_REPLIES
      }
    ]);
  };

  const handleInlineLeadSubmit = async (e: React.FormEvent, msgId: string) => {
    e.preventDefault();
    const cleanPhone = leadPhone.replace(/[\s.-]/g, '');
    if (!/^0\d{9}$/.test(cleanPhone)) {
      onShowToast('Vui lòng nhập số điện thoại hợp lệ (10 chữ số).');
      return;
    }

    setIsSubmittingLead(true);
    await submitLead({
      type: 'quote',
      typeName: 'Báo giá qua Trợ lý AI',
      fullName: leadName.trim() || 'Khách hàng Trợ lý AI',
      phone: cleanPhone,
      carName: leadCar,
      note: 'Đăng ký trực tiếp từ hộp chat Trợ lý AI 24/7'
    });
    setIsSubmittingLead(false);
    setLeadSubmittedIds((prev) => ({ ...prev, [msgId]: true }));
    onShowToast(`Đã gửi yêu cầu tư vấn ${leadCar} thành công!`);
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className={line.trim() === '' ? 'h-2' : 'leading-relaxed'}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={j} className="font-bold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={j}>{part}</span>;
          })}
        </p>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[410px] max-h-[82vh] h-[620px] bg-white rounded-[24px] shadow-[0_16px_48px_rgba(15,23,42,0.24)] border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#1464F4] text-white px-4 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-xs border border-white/30 flex items-center justify-center">
              <Bot size={22} className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#0F172A] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm tracking-tight">Trợ Lý AI VinFast 3S</h3>
              <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={10} /> 24/7
              </span>
            </div>
            <p className="text-[11px] text-blue-100">
              Báo giá lăn bánh • Trả góp • So sánh xe tự động
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleResetChat}
            title="Làm mới cuộc trò chuyện"
            className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            onClick={onToggle}
            title="Đóng cửa sổ chat"
            className="p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Top Quick Bar: Direct Hotline & Zalo */}
      <div className="bg-slate-50 border-b border-slate-200/70 px-3.5 py-2 flex items-center justify-between text-[11px] shrink-0">
        <span className="text-slate-600 font-medium flex items-center gap-1">
          <ShieldCheck size={13} className="text-[#1464F4]" />
          Đại lý 3S Bình Phước
        </span>
        <div className="flex items-center gap-2">
          <a
            href={DEALERSHIP_INFO.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0068FF] hover:underline font-bold flex items-center gap-1"
          >
            <MessageSquare size={12} />
            Chat Zalo
          </a>
          <span className="text-slate-300">|</span>
          <a
            href={`tel:${DEALERSHIP_INFO.hotline.replace(/\./g, '')}`}
            className="text-emerald-600 hover:underline font-bold flex items-center gap-1"
          >
            <Phone size={12} />
            {DEALERSHIP_INFO.hotline}
          </a>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 bg-[#F8FAFC]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-[#1464F4] text-white rounded-br-xs'
                  : 'bg-white text-slate-700 border border-slate-200/80 rounded-bl-xs'
              }`}
            >
              {msg.sender === 'bot' ? (
                <div className="space-y-1">{renderFormattedText(msg.text)}</div>
              ) : (
                <p className="leading-relaxed">{msg.text}</p>
              )}
            </div>

            {/* If message contains Car Cards */}
            {msg.cars && msg.cars.length > 0 && (
              <div className="w-full mt-2.5 space-y-2">
                {msg.cars.map((car) => (
                  <div
                    key={car.id}
                    className="bg-white rounded-xl border border-slate-200/90 p-2.5 shadow-2xs hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={car.imageUrl}
                        alt={car.name}
                        className="w-20 h-14 object-contain bg-slate-50 rounded-lg p-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                            {car.name}
                          </h4>
                          <span className="text-[10px] font-bold bg-blue-50 text-[#1464F4] px-2 py-0.5 rounded-md shrink-0">
                            {car.seatsDisplay}
                          </span>
                        </div>
                        <p className="text-xs font-extrabold text-[#1464F4] mt-0.5">
                          {formatCurrency(car.price)}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          ⚡ {car.rangeDisplay} • Góp ~{formatMillion(car.monthlyInstallmentEstimate)}/tháng
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onSelectCarDetail(car)}
                        className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                      >
                        Chi tiết
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenCalculatorForCar(car)}
                        className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-[#1464F4] font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Calculator size={11} />
                        Trả góp
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenQuoteForCar(car)}
                        className="py-1.5 px-2 bg-[#1464F4] hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                      >
                        Báo giá
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* If message contains Side-by-Side Comparison Table */}
            {msg.comparison && (
              <div className="w-full mt-2.5 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs text-xs">
                <div className="grid grid-cols-3 bg-slate-900 text-white font-bold py-2 px-2.5 text-[11px]">
                  <div>Thông số</div>
                  <div className="text-center text-blue-300">{msg.comparison.carA.name}</div>
                  <div className="text-center text-emerald-300">{msg.comparison.carB.name}</div>
                </div>
                <div className="divide-y divide-slate-100 text-[11px]">
                  <div className="grid grid-cols-3 py-2 px-2.5 items-center">
                    <span className="text-slate-500 font-medium">Giá niêm yết</span>
                    <span className="text-center font-bold text-slate-900">
                      {formatMillion(msg.comparison.carA.price)}
                    </span>
                    <span className="text-center font-bold text-slate-900">
                      {formatMillion(msg.comparison.carB.price)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 py-2 px-2.5 items-center bg-slate-50/60">
                    <span className="text-slate-500 font-medium">Trả trước 20%</span>
                    <span className="text-center font-semibold text-[#1464F4]">
                      ~{formatMillion(Math.round(msg.comparison.carA.price * 0.2))}
                    </span>
                    <span className="text-center font-semibold text-emerald-600">
                      ~{formatMillion(Math.round(msg.comparison.carB.price * 0.2))}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 py-2 px-2.5 items-center">
                    <span className="text-slate-500 font-medium">Số chỗ ngồi</span>
                    <span className="text-center font-semibold">{msg.comparison.carA.seatsDisplay}</span>
                    <span className="text-center font-semibold">{msg.comparison.carB.seatsDisplay}</span>
                  </div>
                  <div className="grid grid-cols-3 py-2 px-2.5 items-center bg-slate-50/60">
                    <span className="text-slate-500 font-medium">Quãng đường</span>
                    <span className="text-center font-semibold">{msg.comparison.carA.rangeDisplay}</span>
                    <span className="text-center font-semibold">{msg.comparison.carB.rangeDisplay}</span>
                  </div>
                  <div className="grid grid-cols-3 py-2 px-2.5 items-center">
                    <span className="text-slate-500 font-medium">Công suất</span>
                    <span className="text-center font-semibold">{msg.comparison.carA.horsepower} Hp</span>
                    <span className="text-center font-semibold">{msg.comparison.carB.horsepower} Hp</span>
                  </div>
                  <div className="grid grid-cols-3 py-2 px-2.5 items-center bg-slate-50/60">
                    <span className="text-slate-500 font-medium">Góp/tháng</span>
                    <span className="text-center font-semibold">
                      ~{formatMillion(msg.comparison.carA.monthlyInstallmentEstimate)}
                    </span>
                    <span className="text-center font-semibold">
                      ~{formatMillion(msg.comparison.carB.monthlyInstallmentEstimate)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onOpenQuoteForCar(msg.comparison!.carA)}
                    className="py-1.5 bg-[#1464F4] text-white font-bold text-[11px] rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Báo giá {msg.comparison.carA.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenQuoteForCar(msg.comparison!.carB)}
                    className="py-1.5 bg-emerald-600 text-white font-bold text-[11px] rounded-lg hover:bg-emerald-700 cursor-pointer"
                  >
                    Báo giá {msg.comparison.carB.name}
                  </button>
                </div>
              </div>
            )}

            {/* If message contains Inline Lead Form */}
            {msg.showLeadForm && (
              <div className="w-full mt-2.5 bg-white rounded-xl border border-blue-200 p-3 shadow-2xs">
                {leadSubmittedIds[msg.id] ? (
                  <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold py-2">
                    <CheckCircle2 size={18} />
                    <span>Đã gửi thông tin! Chuyên viên VinFast 3S sẽ liên hệ ngay.</span>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleInlineLeadSubmit(e, msg.id)} className="space-y-2">
                    <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Gift size={14} className="text-[#1464F4]" />
                      <span>Nhận báo giá lăn bánh & Ưu đãi qua Zalo</span>
                    </div>
                    <select
                      value={leadCar}
                      onChange={(e) => setLeadCar(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-hidden focus:border-[#1464F4]"
                    >
                      {VINFAST_CARS.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} - {formatCurrency(c.price)}
                        </option>
                      ))}
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Tên anh/chị"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1464F4]"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Số điện thoại *"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#1464F4]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="w-full py-2 bg-[#1464F4] hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      {isSubmittingLead ? 'Đang gửi...' : 'Gửi yêu cầu nhận báo giá ngay'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Quick Reply Chips */}
            {msg.quickReplies && msg.quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {msg.quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUserAction(qr.label, qr.action)}
                    className="px-2.5 py-1.5 bg-white hover:bg-[#EBF3FF] text-slate-700 hover:text-[#1464F4] border border-slate-200 hover:border-blue-300 rounded-xl text-[11px] font-semibold transition-all shadow-2xs cursor-pointer"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            )}

            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2.5 animate-in fade-in duration-200">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#1464F4] flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Bot size={14} />
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-2xl rounded-bl-xs px-3.5 py-2.5 shadow-2xs">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#1464F4] rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-[#1464F4] rounded-full animate-bounce [animation-delay:180ms]" />
                <span className="w-2 h-2 bg-[#1464F4] rounded-full animate-bounce [animation-delay:360ms]" />
              </div>
              <span className="text-[11px] text-slate-500 font-medium italic">
                Đang soạn tin nhắn...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <form
        onSubmit={handleSendText}
        className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nhập tên xe, tầm tiền hoặc SĐT của bạn..."
          className="flex-1 bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-xs sm:text-[13px] text-slate-800 px-3.5 py-2.5 rounded-full border border-transparent focus:border-[#1464F4] focus:outline-hidden transition-all"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="w-9 h-9 rounded-full bg-[#1464F4] hover:bg-blue-700 disabled:bg-slate-200 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};
