import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Calculator } from 'lucide-react-native';
import theme from '../constants/theme';
import { animScale } from '../game/settings';
import { ruleSequence, ruleTitle, type Rule } from '../game/rules';

type Props = {
  rule: Rule;
  flashTick: number;
};

/** The gold hero of the floating control bar. Lifts and flashes on a miss. */
function RuleCardBase({ rule, flashTick }: Props) {
  const lift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (flashTick <= 0 || animScale() === 0) {
      return;
    }
    lift.setValue(0);
    Animated.sequence([
      Animated.timing(lift, { toValue: 1, duration: 160, useNativeDriver: true }),
      Animated.timing(lift, { toValue: 0, duration: 240, useNativeDriver: true }),
    ]).start();
  }, [flashTick, lift]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        transform: [
          { translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) },
        ],
      }}>
      <LinearGradient
        colors={theme.gradients.rule as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}>
        <View style={styles.iconTile}>
          <Calculator size={22} color={theme.colors.accent} strokeWidth={2.4} />
        </View>
        <View style={styles.text}>
          <Text style={styles.kicker}>RULE</Text>
          <Text style={styles.title} numberOfLines={1}>
            {ruleTitle(rule)}
          </Text>
          <Text style={styles.sequence} numberOfLines={1}>
            {ruleSequence(rule)}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 92,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,209,102,0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
    shadowColor: '#FFD166',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 10,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,209,102,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,209,102,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
  kicker: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.accent,
    opacity: 0.8,
  },
  title: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.text,
  },
  sequence: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.primary,
    fontVariant: ['tabular-nums'],
  },
});

export const RuleCard = memo(RuleCardBase);
export default RuleCard;
