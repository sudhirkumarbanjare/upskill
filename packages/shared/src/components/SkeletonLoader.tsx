import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, ViewStyle, Animated, Easing} from 'react-native';
import {colors, radius as themeRadius, spacing} from '../theme';

interface SkeletonBoxProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonBox({
  width,
  height,
  borderRadius = themeRadius.md,
  style,
}: SkeletonBoxProps) {
  const shimmer = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 0.7,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [shimmer]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.neutral[700],
          opacity: shimmer,
        },
        style,
      ]}
    />
  );
}

// Pre-composed skeleton layouts
export function SkeletonCard() {
  return (
    <View style={skeletonStyles.card}>
      <SkeletonBox width="100%" height={140} borderRadius={themeRadius.lg} />
      <View style={skeletonStyles.cardContent}>
        <SkeletonBox width="70%" height={18} />
        <SkeletonBox width="90%" height={14} style={{marginTop: spacing.sm}} />
        <SkeletonBox width="40%" height={14} style={{marginTop: spacing.sm}} />
      </View>
    </View>
  );
}

export function SkeletonListItem() {
  return (
    <View style={skeletonStyles.listItem}>
      <SkeletonBox width={48} height={48} borderRadius={themeRadius.full} />
      <View style={skeletonStyles.listItemContent}>
        <SkeletonBox width="60%" height={16} />
        <SkeletonBox width="80%" height={12} style={{marginTop: spacing.xs}} />
      </View>
    </View>
  );
}

export function SkeletonProfile() {
  return (
    <View style={skeletonStyles.profile}>
      <SkeletonBox width={80} height={80} borderRadius={themeRadius.full} />
      <SkeletonBox width="50%" height={22} style={{marginTop: spacing.base}} />
      <SkeletonBox width="35%" height={14} style={{marginTop: spacing.sm}} />
      <View style={skeletonStyles.profileStats}>
        <SkeletonBox width={80} height={60} borderRadius={themeRadius.md} />
        <SkeletonBox width={80} height={60} borderRadius={themeRadius.md} />
        <SkeletonBox width={80} height={60} borderRadius={themeRadius.md} />
      </View>
    </View>
  );
}

export function SkeletonList({count = 5}: {count?: number}) {
  return (
    <View>
      {Array.from({length: count}).map((_, i) => (
        <SkeletonListItem key={i} />
      ))}
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: themeRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.base,
  },
  cardContent: {
    padding: spacing.base,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    gap: spacing.md,
  },
  listItemContent: {
    flex: 1,
  },
  profile: {
    alignItems: 'center',
    padding: spacing['2xl'],
  },
  profileStats: {
    flexDirection: 'row',
    gap: spacing.base,
    marginTop: spacing.xl,
  },
});
