import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const BRANCH_SEO_MAP: Record<string, {title: string; description: string}> = {
  home: {
    title: 'Thông Tin & Báo Giá Xe VinFast 3S',
    description:
      'Thông tin và báo giá các dòng xe điện VinFast mới nhất tại Đại lý VinFast 3S. Dự toán chi phí lăn bánh trọn gói, tính trả góp ngân hàng lãi suất ưu đãi và đặc quyền khuyến mãi hấp dẫn!',
  },
  'binh-phuoc': {
    title: 'Thông Tin & Báo Giá Xe VinFast tại Bình Phước',
    description:
      'Thông tin và báo giá các dòng xe điện VinFast mới nhất tại Bình Phước. Dự toán chi phí lăn bánh trọn gói, tính trả góp ngân hàng lãi suất ưu đãi và đặc quyền khuyến mãi hấp dẫn!',
  },
  'dong-xoai': {
    title: 'Thông Tin & Báo Giá Xe VinFast tại Đồng Xoài',
    description:
      'Thông tin và báo giá các dòng xe điện VinFast mới nhất tại Đồng Xoài. Dự toán chi phí lăn bánh trọn gói, tính trả góp ngân hàng lãi suất ưu đãi và đặc quyền khuyến mãi hấp dẫn!',
  },
  'dak-lak': {
    title: 'Thông Tin & Báo Giá Xe VinFast tại Đắk Lắk',
    description:
      'Thông tin và báo giá các dòng xe điện VinFast mới nhất tại Đắk Lắk. Dự toán chi phí lăn bánh trọn gói, tính trả góp ngân hàng lãi suất ưu đãi và đặc quyền khuyến mãi hấp dẫn!',
  },
};

function applyBranchMetaToHtml(html: string, branchKey: string): string {
  const seo = BRANCH_SEO_MAP[branchKey] || BRANCH_SEO_MAP['home'];
  return html
    .replace(/<title>.*?<\/title>/s, `<title>${seo.title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/>/s,
      `<meta name="description" content="${seo.description}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content=".*?"\s*\/>/s,
      `<meta property="og:title" content="${seo.title}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content=".*?"\s*\/>/s,
      `<meta property="og:description" content="${seo.description}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content=".*?"\s*\/>/s,
      `<meta name="twitter:title" content="${seo.title}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content=".*?"\s*\/>/s,
      `<meta name="twitter:description" content="${seo.description}" />`
    );
}

function resolveBranchKeyFromUrl(urlPath?: string): string {
  if (!urlPath) return 'home';
  const clean = urlPath.split('?')[0].split('/').filter(Boolean)[0] || '';
  if (!clean) return 'home';
  const slug = clean.toLowerCase().replace(/[^a-z0-9]+/g, '');
  if (slug === 'binhphuoc' || slug === 'bp') return 'binh-phuoc';
  if (slug === 'dongxoai' || slug === 'dx') return 'dong-xoai';
  if (slug === 'daklak' || slug === 'daclac' || slug === 'dl' || slug === 'bmt' || slug === 'buonmathuot') {
    return 'dak-lak';
  }
  return 'home';
}

function branchSeoPlugin(): Plugin {
  return {
    name: 'branch-seo-plugin',
    transformIndexHtml(html, ctx) {
      const branchKey = resolveBranchKeyFromUrl(ctx.originalUrl);
      return applyBranchMetaToHtml(html, branchKey);
    },
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const baseIndexHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(baseIndexHtmlPath)) return;

      const baseHtml = fs.readFileSync(baseIndexHtmlPath, 'utf-8');
      const staticRoutes: {routeDir: string; branchKey: string}[] = [
        {routeDir: 'binh-phuoc', branchKey: 'binh-phuoc'},
        {routeDir: 'binhphuoc', branchKey: 'binh-phuoc'},
        {routeDir: 'dong-xoai', branchKey: 'dong-xoai'},
        {routeDir: 'dongxoai', branchKey: 'dong-xoai'},
        {routeDir: 'dak-lak', branchKey: 'dak-lak'},
        {routeDir: 'daklak', branchKey: 'dak-lak'},
        {routeDir: 'bmt', branchKey: 'dak-lak'},
      ];

      for (const item of staticRoutes) {
        const targetDir = path.join(distDir, item.routeDir);
        fs.mkdirSync(targetDir, {recursive: true});
        const customHtml = applyBranchMetaToHtml(baseHtml, item.branchKey);
        fs.writeFileSync(path.join(targetDir, 'index.html'), customHtml, 'utf-8');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), branchSeoPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
