// src/constants/theme.js
//
// Single source of truth for design tokens. Every screen imports from here
// instead of hardcoding hex codes / pixel values, so a re-theme later is a
// one-file change.

export const colors = {
  // Brand
  navy: '#0D1C32',        // header / dark surfaces
  navyLight: '#16273F',   // secondary dark surface (cards on dark bg)
  orange: '#F4831F',      // primary accent / CTA
  orangeLight: '#FFF1E4', // accent tint background (badges, chips)

  // Neutrals
  white: '#FFFFFF',
  background: '#F5F6F8',  // app background (light grey)
  card: '#FFFFFF',
  border: '#E8EAEE',
  textPrimary: '#101828',
  textSecondary: '#667085',
  textMuted: '#98A2B3',
  placeholder: '#B0B7C3',

  // Status
  success: '#1FA97D',
  successBg: '#E7F8F1',
  warning: '#F4831F',
  warningBg: '#FFF1E4',
  danger: '#E4483F',
  dangerBg: '#FDEBEA',
  info: '#2E6FF2',
  infoBg: '#EAF1FF',

  star: '#F5B942',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 24, fontWeight: '700' },
  h2: { fontSize: 20, fontWeight: '700' },
  h3: { fontSize: 17, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  bodyBold: { fontSize: 15, fontWeight: '600' },
  small: { fontSize: 13, fontWeight: '400' },
  tiny: { fontSize: 11, fontWeight: '500' },
};

// Single source of truth for the currency symbol shown across the app
// (quotes, pro rates, chat quote cards). Every screen renders prices via
// this constant instead of hardcoding a symbol - change it here once if
// the app ever needs to support another market's currency.
export const CURRENCY = '£';

export const shadow = {
  card: {
    shadowColor: '#0D1C32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
};

export default { colors, spacing, radius, typography, shadow, CURRENCY };
