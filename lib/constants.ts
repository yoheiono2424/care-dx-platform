/**
 * アプリケーション全体で使用する定数
 */

// レスポンシブブレークポイント
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// カラーパレット
export const COLORS = {
  primary: '#3b82f6',
  secondary: '#64748b',
  accent: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981',
  info: '#3b82f6',
} as const;

// アプリケーション情報
export const APP_INFO = {
  name: '介護業務DX支援プラットフォーム',
  version: '1.0.0',
  description: '介護・訪問看護現場における情報管理の一元化プラットフォーム',
} as const;
