import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import StatCard, { type StatItem } from './StatCard';

type Props = {
  items: StatItem[];
};

/**
 * Renders only when at least two pills carry a real value — a lone pill
 * looks orphaned and an empty pill reads as a broken skeleton (rule #21).
 */
function StatRowBase({ items }: Props) {
  const visible = items.filter(i => i.weight > 0);
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={styles.row}>
      {visible.map(item => (
        <View key={item.key} style={styles.slot}>
          <StatCard value={item.value} label={item.label} valueColor={item.valueColor} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  slot: {
    flex: 1,
  },
});

export const StatRow = memo(StatRowBase);
export default StatRow;
