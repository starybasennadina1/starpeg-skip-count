import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { animScale } from '../game/settings';
import { exampleRows, ruleTitle, type Rule } from '../game/rules';
import PrimaryButton from './PrimaryButton';

type Props = {
  rule: Rule;
  visible: boolean;
  onClose: () => void;
};

function WorkedExampleOverlayBase({ rule, visible, onClose }: Props) {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: visible ? 1 : 0,
      duration: 220 * Math.max(animScale(), 0.0001),
      useNativeDriver: true,
    }).start();
  }, [visible, fade]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: fade }]}>
      <View style={styles.card}>
        <Text style={styles.kicker}>WORKED EXAMPLE</Text>
        <Text style={styles.title}>{ruleTitle(rule)}</Text>

        <View style={styles.rows}>
          {exampleRows(rule).map(row => (
            <View key={row} style={styles.row}>
              <View style={styles.bar} />
              <Text style={styles.rowText}>{row}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.hint}>TAP THE STARS IN THAT ORDER</Text>
        <PrimaryButton
          label="GOT IT"
          onPress={onClose}
          height={50}
          colors={theme.gradients.gold}
          glowColor={theme.colors.accent}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(4,8,26,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: 'rgba(16,24,58,0.97)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,209,102,0.35)',
    padding: 20,
  },
  kicker: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.accent,
  },
  title: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: theme.colors.text,
  },
  rows: {
    marginTop: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(43,55,104,0.55)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  bar: {
    width: 3,
    height: 20,
    borderRadius: 2,
    backgroundColor: theme.colors.accent,
  },
  rowText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.primary,
    opacity: 0.8,
    textAlign: 'center',
  },
});

export const WorkedExampleOverlay = memo(WorkedExampleOverlayBase);
export default WorkedExampleOverlay;
