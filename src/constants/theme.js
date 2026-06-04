export const COLORS = {
  primary: '#1a73e8',
  primaryDark: '#1557b0',
  primaryLight: '#4a9af5',
  secondary: '#34a853',
  accent: '#ea4335',
  warning: '#fbbc04',
  background: '#f5f7fa',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  textLight: '#9ca3af',
  border: '#e5e7eb',
  error: '#dc2626',
  success: '#16a34a',
  white: '#ffffff',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
  cardShadow: 'rgba(0,0,0,0.08)',
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
  },
  icon: 22,
};

export const FONTS = {
  regular: { fontSize: 14, fontWeight: '400' },
  medium: { fontSize: 14, fontWeight: '500' },
  semibold: { fontSize: 14, fontWeight: '600' },
  bold: { fontSize: 14, fontWeight: '700' },
  h1: { fontSize: 28, fontWeight: '700' },
  h2: { fontSize: 22, fontWeight: '700' },
  h3: { fontSize: 18, fontWeight: '600' },
  h4: { fontSize: 16, fontWeight: '600' },
  caption: { fontSize: 12, fontWeight: '400' },
};

export const SHADOWS = {
  sm: {
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
};
