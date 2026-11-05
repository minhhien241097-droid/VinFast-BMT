export interface CarVersionPrice {
  name: string;
  price: number;
}

export interface CarModel {
  id: string;
  name: string;
  versions?: string; // e.g. "Eco và Plus", "Tiêu chuẩn, Nâng cao, Cửa trượt", "Eco, Plus và THM"
  versionBadge?: string; // e.g. "Eco và Plus", "Plus", "Tiêu chuẩn"
  tagline: string;
  segment: string;
  categoryGroup: 'mini' | 'suv5' | 'luxury' | 'suv7' | 'pickup' | 'service';
  categoryLabel: string;
  seats: number;
  bodyType: 'SUV' | 'Mini SUV' | 'Hatchback' | 'Sedan' | 'MPV' | 'Van' | 'Pickup';
  price: number; // in VND (Giá niêm yết khởi điểm)
  versionPrices?: CarVersionPrice[];
  priceNoBattery?: number; // legacy backward compatibility
  priceWithBattery?: number;
  rangePerCharge: number; // in km
  rangeText: string; // e.g. "210 km (NEDC) / lần sạc đầy"
  rangeDisplay?: string; // e.g. "210 km/lần sạc"
  batteryCapacity: number; // in kWh
  batteryDisplay?: string; // e.g. "18,3 kWh"
  seatsDisplay?: string; // e.g. "4 chỗ", "6-7 chỗ"
  powerKw?: string; // e.g. "30 kW", "100 kW", "150 kW", "260 kW", "170 kW", "300 kW"
  chargingTimeFast: string;
  horsepower: number;
  torque: number;
  drivetrain: string;
  description: string;
  keyFeatures: string[];
  imageUrl: string;
  bannerUrl?: string;
  colors: {
    name: string;
    hex: string;
    roofHex?: string;
    colorCode: string;
    extraFee?: number;
    isAdvanced?: boolean;
  }[];
  monthlyInstallmentEstimate: number; // in VND
  badge?: string;
  isPopular?: boolean;
  dimensions?: string; // D x R x C in mm
  wheelbase?: string; // in mm
  groundClearance?: string; // in mm
  depositAmount?: number; // in VND
  depositUrl?: string; // official VinFast deposit URL
  warrantyCar?: string;
  warrantyBattery?: string;
  topSpeed?: string;
  wheelSize?: string;
}

export interface AccessoryItem {
  id: string;
  name: string;
  category: 'Ngoại thất' | 'Nội thất' | 'Công nghệ & Sạc' | 'Bảo dưỡng & An toàn';
  price: number;
  description: string;
  warranty: string;
  popular?: boolean;
}

export interface PromotionItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  details: string[];
  validUntil: string;
}

export interface TestDriveBooking {
  fullName: string;
  phone: string;
  carModelId: string;
  city: string;
  district: string;
  driveType: 'showroom' | 'home';
  address?: string;
  preferredDate: string;
  note?: string;
}

export interface QuoteRequest {
  fullName: string;
  phone: string;
  carModelId: string;
  paymentMethod: 'cash' | 'installment';
  downPaymentPercent: number;
  city: string;
  note?: string;
}
