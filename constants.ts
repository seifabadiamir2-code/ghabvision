import { FrameSize } from './types';

export const ADMIN_PHONE_NUMBER = '09032455335';
export const ADMIN_PHONE_NUMBER_WITH_COUNTRY_CODE = `98${ADMIN_PHONE_NUMBER.substring(1)}`;
export const ADMIN_INSTAGRAM_ID = 'ghabvision'; 

export const PRODUCT_TYPES = [
  { value: 'frame', label: 'ساخت قاب عکس (چاپ + قاب)' },
  { value: 'mdf', label: 'چاپ روی تخته شاسی (MDF)' },
];

export const FRAME_SIZES: FrameSize[] = [
  { value: 'a5', label: 'A5 (۱۴.۸ × ۲۱ سانتی‌متر)', aspectRatio: 14.8 / 21 },
  { value: 'a4', label: 'A4 (۲۱ × ۲۹.۷ سانتی‌متر)', aspectRatio: 21 / 29.7 },
  { value: 'a3', label: 'A3 (۲۹.۷ × ۴۲ سانتی‌متر)', aspectRatio: 29.7 / 42 },
  { value: '10x15', label: '۱۰ × ۱۵ سانتی‌متر', aspectRatio: 10 / 15 },
  { value: '13x18', label: '۱۳ × ۱۸ سانتی‌متر', aspectRatio: 13 / 18 },
  { value: '16x21', label: '۱۶ × ۲۱ سانتی‌متر', aspectRatio: 16 / 21 },
  { value: '20x25', label: '۲۰ × ۲۵ سانتی‌متر', aspectRatio: 20 / 25 },
  { value: '20x30', label: '۲۰ × ۳۰ سانتی‌متر', aspectRatio: 20 / 30 },
  { value: '30x40', label: '۳۰ × ۴۰ سانتی‌متر', aspectRatio: 30 / 40 },
  { value: '30x45', label: '۳۰ × ۴۵ سانتی‌متر', aspectRatio: 30 / 45 },
  { value: '40x60', label: '۴۰ × ۶۰ سانتی‌متر', aspectRatio: 40 / 60 },
  { value: '50x70', label: '۵۰ × ۷۰ سانتی‌متر', aspectRatio: 50 / 70 },
  { value: '60x90', label: '۶۰ × ۹۰ سانتی‌متر', aspectRatio: 60 / 90 },
];

export const FRAME_MATERIALS = [
    { value: 'pvc', label: 'PVC' },
    { value: 'metal', label: 'فلزی' }
];

export const PVC_TEXTURES = [
    { value: 'smooth-matte', label: 'صاف مات' },
    { value: 'smooth-glossy', label: 'صاف براق' },
    { value: 'fine-lines', label: 'خطوط ظریف' },
    { value: 'textured', label: 'بافت‌دار' },
];

export const FRAME_COLORS = [
  '#111827', '#F9FAFB', '#6B7280', '#D1D5DB', 
  '#A3A3A3', '#737373',
  '#F5F5F4', '#E7E5E4',
  '#262626', '#FFFFFF',
  '#92400E', '#A16207', '#B45309',
  '#065F46', '#15803D', '#047857',
  '#1D4ED8', '#3730A3', '#6D28D9',
  '#BE123C', '#DC2626',
];

export const COVER_TYPES = [
  { value: 'glass', label: 'شیشه معمولی شفاف ساده' },
  { value: 'plexiglas', label: 'پلکسی گلاس' },
  { value: 'none', label: 'بدون شیشه' },
];