export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatMillionVND(amount: number): string {
  if (amount >= 1000000000) {
    const billions = amount / 1000000000;
    return `${billions.toFixed(billions % 1 === 0 ? 0 : 2)} tỷ VNĐ`;
  }
  const millions = amount / 1000000;
  return `${millions.toFixed(millions % 1 === 0 ? 0 : 1)} triệu VNĐ`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

export function getColorBackgroundStyle(hex: string, roofHex?: string): React.CSSProperties {
  if (roofHex) {
    return {
      background: `linear-gradient(135deg, ${hex} 50%, ${roofHex} 50%)`
    };
  }
  return {
    backgroundColor: hex
  };
}

