import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PEG_DISC, PEG_HALO } from '../constants/config';
import theme from '../constants/theme';
import { animScale } from '../game/settings';
import type { Point } from '../utils/geometry';

type Props = {
  value: number;
  centre: Point;
  lit: boolean;
  /** position in the accepted chain — later stars ring a little wider */
  order: number;
  hint: boolean;
  shakeTick: number;
};

/**
 * Pure visual. Hit-testing happens in the board's PanResponder, so the peg is
 * pointerEvents="none" and the touch coordinates stay relative to the board.
 */
function StarPegBase({ value, centre, lit, order, hint, shakeTick }: Props) {
  const burst = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const litRef = useRef(lit);

  useEffect(() => {
    if (lit && !litRef.current) {
      burst.setValue(0);
      Animated.timing(burst, {
        toValue: 1,
        duration: 420 * Math.max(animScale(), 0.0001),
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
    litRef.current = lit;
  }, [lit, burst]);

  useEffect(() => {
    if (shakeTick <= 0) {
      return;
    }
    const s = animScale();
    if (s === 0) {
      return;
    }
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 90, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 90, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 90, useNativeDriver: true }),
    ]).start();
  }, [shakeTick, shake]);

  useEffect(() => {
    if (!hint || animScale() === 0) {
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [hint, pulse]);

  const ringMax = Math.min(1.3 + order * 0.02, 1.55);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.root,
        {
          left: centre.x - PEG_HALO / 2,
          top: centre.y - PEG_HALO / 2,
          transform: [
            {
              translateX: shake.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [-5, 0, 5],
              }),
            },
          ],
        },
      ]}>
      <Animated.View
        style={[
          styles.halo,
          {
            backgroundColor: 'rgba(255,209,102,0.22)',
            opacity: burst.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] }),
            transform: [
              { scale: burst.interpolate({ inputRange: [0, 1], outputRange: [1, ringMax] }) },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.halo,
          {
            backgroundColor: 'rgba(255,209,102,0.18)',
            borderWidth: 1,
            borderColor: 'rgba(255,209,102,0.55)',
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.62] }),
          },
        ]}
      />

      {lit ? (
        <LinearGradient
          colors={theme.gradients.gold as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.disc}>
          <Text style={[styles.number, styles.numberLit]}>{value}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.disc, styles.discUnlit]}>
          <Text style={styles.number}>{value}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    width: PEG_HALO,
    height: PEG_HALO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: PEG_HALO,
    height: PEG_HALO,
    borderRadius: PEG_HALO / 2,
  },
  disc: {
    width: PEG_DISC,
    height: PEG_DISC,
    borderRadius: PEG_DISC / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFE49B',
  },
  discUnlit: {
    backgroundColor: theme.colors.surfaceAlt,
    borderColor: 'rgba(142,168,255,0.45)',
  },
  number: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
    color: theme.colors.primary,
    fontVariant: ['tabular-nums'],
  },
  numberLit: {
    color: theme.colors.bg,
  },
});

export const StarPeg = memo(StarPegBase);
export default StarPeg;
