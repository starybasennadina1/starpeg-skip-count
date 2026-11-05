import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';
import type { IconComponent } from './PrimaryButton';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  width?: number | '100%';
  height?: number;
  tint?: string;
  flex?: boolean;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
/** Same 24px icon contract as PrimaryButton — never mix sizes on one screen. */
const ICON = 24;

function SecondaryButtonBase({
  label,
  onPress,
  Icon,
  width = '100%',
  height = 48,
  tint = theme.colors.primary,
  flex = false,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={flex ? { flex: 1, height } : { width, height }}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.shell,
          {
            height,
            borderColor: tint + '4D',
            transform: [{ scale }],
          },
        ]}>
        <View style={styles.row}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon size={ICON} color={tint} strokeWidth={2.2} />
            </View>
          ) : null}
          <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(142,168,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconBox: {
    width: ICON,
    height: ICON,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 1.8,
    lineHeight: ICON,
  },
});

export const SecondaryButton = memo(SecondaryButtonBase);
export default SecondaryButton;
