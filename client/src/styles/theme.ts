import type React from 'react';

export const COLORS = {
  navy:       '#0B1F3A',
  teal:       '#0D9488',
  tealLight:  '#14B8A6',
  tealDark:   '#0F766E',
  gold:       '#F59E0B',
  cream:      '#F8F5EE',
  slate:      '#334155',
  slateLight: '#64748B',
  white:      '#FFFFFF',
  red:        '#EF4444',
  green:      '#10B981',
  cardBg:     '#132338',
  cardBorder: '#1E3A5F',
  sidebarBg:  '#091729',
} as const;

export const CARD_STYLE: React.CSSProperties = {
  background:   COLORS.cardBg,
  border:       `1px solid ${COLORS.cardBorder}`,
  borderRadius: 16,
  padding:      24,
};

export const CARD_STYLE_MOBILE: React.CSSProperties = {
  ...CARD_STYLE,
  padding:      16,
  borderRadius: 12,
};

export const INPUT_STYLE: React.CSSProperties = {
  background:   '#0B1F3A',
  border:       `1px solid ${COLORS.cardBorder}`,
  borderRadius: 10,
  color:        COLORS.cream,
  padding:      '10px 14px',
  fontSize:     14,
  fontFamily:   "'DM Sans', sans-serif",
  outline:      'none',
  width:        '100%',
  boxSizing:    'border-box',
};

export const BTN_PRIMARY: React.CSSProperties = {
  background:   `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark})`,
  color:        COLORS.white,
  border:       'none',
  borderRadius: 10,
  padding:      '10px 20px',
  fontFamily:   "'DM Sans', sans-serif",
  fontWeight:   600,
  fontSize:     14,
  cursor:       'pointer',
  display:      'flex',
  alignItems:   'center',
  gap:          8,
};

export const BTN_SECONDARY: React.CSSProperties = {
  background:   'transparent',
  color:        COLORS.tealLight,
  border:       `1px solid ${COLORS.teal}`,
  borderRadius: 10,
  padding:      '10px 20px',
  fontFamily:   "'DM Sans', sans-serif",
  fontWeight:   600,
  fontSize:     14,
  cursor:       'pointer',
  display:      'flex',
  alignItems:   'center',
  gap:          8,
};

export const LABEL_STYLE: React.CSSProperties = {
  fontSize:      12,
  fontWeight:    600,
  color:         COLORS.slateLight,
  letterSpacing: 1,
  textTransform: 'uppercase',
  marginBottom:  6,
};

export const SECTION_TITLE_STYLE: React.CSSProperties = {
  fontSize:     18,
  fontWeight:   700,
  color:        COLORS.cream,
  marginBottom: 16,
};

/** Returns card style based on screen width */
export function cardStyle(isMobile?: boolean): React.CSSProperties {
  return isMobile ? CARD_STYLE_MOBILE : CARD_STYLE;
}

/** Responsive grid: 1 col mobile, 2 col tablet, N col desktop */
export function responsiveGrid(cols: number, isMobile: boolean, isTablet: boolean): React.CSSProperties {
  const actual = isMobile ? 1 : isTablet ? Math.min(2, cols) : cols;
  return { display: 'grid', gridTemplateColumns: `repeat(${actual}, 1fr)`, gap: isMobile ? 12 : 16 };
}
