import React from 'react';
import {Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity, View} from 'react-native';
import {colors, textStyles, spacing, radius} from '../theme';
import {Icon, IconName} from './icons/Icon';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface PremiumButtonProps {
  label?: string;
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName | string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

const VARIANT_STYLES: Record<ButtonVariant, {bg: string; text: string; border?: string; iconColor: string}> = {
  primary: {bg: colors.primary[600], text: colors.white, iconColor: colors.white},
  secondary: {bg: colors.surface.elevated, text: colors.neutral[200], iconColor: colors.neutral[300]},
  outline: {bg: 'transparent', text: colors.primary[400], border: colors.primary[600], iconColor: colors.primary[400]},
  ghost: {bg: 'transparent', text: colors.neutral[300], iconColor: colors.neutral[300]},
  danger: {bg: colors.error[600], text: colors.white, iconColor: colors.white},
};

const SIZE_STYLES: Record<ButtonSize, {py: number; px: number; textStyle: TextStyle; iconSize: number}> = {
  sm: {py: spacing.sm, px: spacing.base, textStyle: textStyles.buttonSmall, iconSize: 14},
  md: {py: spacing.md, px: spacing.xl, textStyle: textStyles.buttonMedium, iconSize: 18},
  lg: {py: spacing.base, px: spacing['2xl'], textStyle: textStyles.buttonLarge, iconSize: 20},
};

export const PremiumButton = React.memo(function PremiumButton({
  label,
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
}: PremiumButtonProps) {
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];

  const renderIcon = () => {
    if (!icon) return null;
    const isIconName = typeof icon === 'string' && [
      'home', 'compass', 'briefcase', 'book-open', 'award', 'graduation-cap',
      'check-square', 'check-circle', 'check', 'user', 'users', 'user-plus',
      'user-check', 'user-x', 'bell', 'bell-ring', 'git-branch', 'cpu', 'server',
      'sparkles', 'zap', 'plus', 'x', 'trash', 'edit', 'search', 'filter',
      'arrow-right', 'arrow-left', 'chevron-right', 'chevron-left', 'chevron-down',
      'chevron-up', 'shield', 'shield-check', 'lock', 'key', 'smartphone',
      'mail', 'phone', 'clock', 'calendar', 'dollar-sign', 'trending-up',
      'activity', 'bar-chart', 'video', 'play', 'image', 'eye', 'eye-off',
      'log-out', 'building', 'send', 'alert-triangle', 'info', 'refresh-cw',
      'code', 'target',
    ].includes(icon);

    if (isIconName) {
      return (
        <Icon
          name={icon as IconName}
          size={sizeStyle.iconSize}
          color={variantStyle.iconColor}
          strokeWidth={2.2}
        />
      );
    }
    return <Text style={[styles.textIcon, {fontSize: sizeStyle.iconSize}]}>{icon}</Text>;
  };

  return (
    <View style={[fullWidth && {width: '100%'}, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.base,
          {
            backgroundColor: variantStyle.bg,
            paddingVertical: sizeStyle.py,
            paddingHorizontal: sizeStyle.px,
          },
          variantStyle.border && {
            borderWidth: 1.5,
            borderColor: variantStyle.border,
          },
          (disabled || loading) && styles.disabled,
          fullWidth && {width: '100%'},
        ]}>
        {iconPosition === 'left' && renderIcon()}
        <Text style={[sizeStyle.textStyle, {color: variantStyle.text}]}>
          {loading ? 'Loading...' : (label ?? title ?? '')}
        </Text>
        {iconPosition === 'right' && renderIcon()}
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    gap: spacing.sm,
    minHeight: 48,
  },
  disabled: {
    opacity: 0.5,
  },
  textIcon: {
    color: colors.neutral[100],
  },
});

