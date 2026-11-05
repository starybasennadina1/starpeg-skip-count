import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet } from 'react-native';
import assets from '../assets';
import theme from '../constants/theme';
import { useAnimScale } from '../game/settings';

type Props = {
  size?: number;
};

/** logo.png inside a pulsing gold ring — the Loader centrepiece. */
function BrandMarkBase({ size = 176 }: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0.45)).current;
  const scale = useAnimScale();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(enter, {
        toValue: 1,
        useNativeDriver: true,
        ...theme.anim.logo,
      }),
    ]).start();
  }, [enter]);

  useEffect(() => {
    if (scale === 0) {
      ring.setValue(0.9);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ring, {
          toValue: 0.9,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ring, {
          toValue: 0.45,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [ring, scale]);

  const logoSize = Math.round(size * 0.84);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          transform: [
            {
              scale: enter.interpolate({
                inputRange: [0, 1],
                outputRange: [0.82, 1],
              }),
            },
          ],
        },
      ]}>
      <Animated.View
        style={[
          styles.ring,
          StyleSheet.absoluteFill,
          { borderRadius: size / 2, opacity: ring },
        ]}
      />
      <Animated.View style={{ opacity: enter }}>
        <Image
          source={assets.logo}
          style={{ width: logoSize, height: logoSize, resizeMode: 'contain' }}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,209,102,0.35)',
    backgroundColor: 'rgba(16,24,58,0.35)',
    shadowColor: '#FFD166',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 14,
  },
});

export const BrandMark = memo(BrandMarkBase);
export default BrandMark;
