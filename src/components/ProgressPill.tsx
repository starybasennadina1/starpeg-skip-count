import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { animScale } from '../game/settings';

type Props = {
  value: string;
  label: string;
  color?: string;
};

/** Header / menu counter pill. Pulses whenever its value changes. */
function ProgressPillBase({ value, label, color = theme.colors.accent }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const s = animScale();
    if (s === 0) {
      return;
    }
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.12, duration: 130, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 130, useNativeDriver: true }),
    ]).start();
  }, [value, pulse]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.pill, { transform: [{ scale: pulse }] }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(43,55,104,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(142,168,255,0.28)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  value: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.primary,
  },
});

export const ProgressPill = memo(ProgressPillBase);
export default ProgressPill;
