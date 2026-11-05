import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

export type StatItem = {
  key: string;
  value: string;
  label: string;
  valueColor: string;
  /** numeric weight used to decide whether the pill is worth rendering */
  weight: number;
};

type Props = {
  value: string;
  label: string;
  valueColor: string;
};

/**
 * Rule #21 — no raster icon. One shape for every pill: accent dot, big
 * tabular value, small uppercase caption. Colour carries the semantics.
 * width:'100%' inside a flex:1 slot — never flex:1 in flex:1 (rule #19a).
 */
function StatCardBase({ value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.accentDot, { backgroundColor: valueColor }]} />
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(16,24,58,0.62)',
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.textMuted,
  },
});

export const StatCard = memo(StatCardBase);
export default StatCard;
