import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';
import type { IconComponent } from './PrimaryButton';

type Props = {
  label: string;
  Icon: IconComponent;
  onPress: () => void;
  active?: boolean;
  width: number;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 16;

function ChipBase({ label, Icon, onPress, active = false, width }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);
  const tint = active ? theme.colors.accent : theme.colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={{ width, height: 40 }}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.chip,
          {
            borderColor: tint + '3D',
            backgroundColor: active ? 'rgba(255,209,102,0.14)' : theme.colors.glassSoft,
            transform: [{ scale }],
          },
        ]}>
        <View style={styles.iconBox}>
          <Icon size={ICON} color={tint} strokeWidth={2.2} />
        </View>
        <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: '100%',
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 6,
  },
  iconBox: {
    width: ICON,
    height: ICON,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    lineHeight: ICON,
  },
});

export const Chip = memo(ChipBase);
export default Chip;
