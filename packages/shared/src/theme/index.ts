// ─── Theme: Barrel Export ───

export {colors} from './colors';
export {fontFamily, fontSize, lineHeight, textStyles} from './typography';
export {spacing, radius, shadows} from './spacing';

// Convenience re-export as a single theme object
import {colors} from './colors';
import {fontFamily, fontSize, lineHeight, textStyles} from './typography';
import {spacing, radius, shadows} from './spacing';

export const theme = {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  textStyles,
  spacing,
  radius,
  shadows,
} as const;

export type Theme = typeof theme;
