import React, { memo, type ReactNode } from 'react';
import { Animated, ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import { STARS_LOADER, STARS_MENU, STARS_RESULT } from '../constants/config';
import theme from '../constants/theme';
import useDrift from '../hooks/useDrift';
import Starfield from './Starfield';

export type AuroraVariant = 'loader' | 'menu' | 'game' | 'result' | 'panel';

const OVERLAYS: Record<AuroraVariant, string[]> = {
  loader: ['rgba(4,8,26,0.92)', 'rgba(16,24,58,0.96)', 'rgba(4,8,26,0.98)'],
  menu: ['rgba(16,24,58,0.30)', 'rgba(16,24,58,0.72)', 'rgba(10,16,42,0.96)'],
  game: ['rgba(10,16,42,0.86)', 'rgba(16,24,58,0.80)', 'rgba(10,16,42,0.92)'],
  result: ['rgba(16,24,58,0.55)', 'rgba(23,32,74,0.80)', 'rgba(10,16,42,0.95)'],
  panel: ['rgba(10,16,42,0.90)', 'rgba(16,24,58,0.86)', 'rgba(10,16,42,0.95)'],
};

const STAR_COUNT: Record<AuroraVariant, number> = {
  loader: STARS_LOADER,
  menu: STARS_MENU,
  game: 22,
  result: STARS_RESULT,
  panel: 24,
};

const BLOB_ALPHA: Record<AuroraVariant, number> = {
  loader: 1,
  menu: 0.9,
  game: 0.5,
  result: 0.8,
  panel: 0.6,
};

type Props = {
  variant: AuroraVariant;
  children?: ReactNode;
};

/**
 * The single source of the distinct per-screen looks: one ImageBackground
 * (bg_game is the ONLY background that ships) + a variant gradient overlay
 * + drifting nebula blobs + the seeded starfield. Four visible depth layers.
 */
function AuroraBackgroundBase({ variant, children }: Props) {
  const driftA = useDrift(6000, 0);
  const driftB = useDrift(7000, 600);
  const driftC = useDrift(5200, 1200);

  const a = BLOB_ALPHA[variant];

  const move = (d: Animated.Value, range: number) =>
    d.interpolate({ inputRange: [0, 1], outputRange: [-range, range] });

  return (
    <ImageBackground source={assets.bgGame} style={styles.root} resizeMode="cover">
      <LinearGradient
        colors={OVERLAYS[variant]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View
          style={[
            styles.blob,
            {
              width: 220,
              height: 220,
              top: -40,
              left: -50,
              backgroundColor: theme.colors.nebulaDeep,
              opacity: 0.35 * a,
              transform: [{ translateX: move(driftA, 8) }, { translateY: move(driftA, 6) }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.blob,
            {
              width: 280,
              height: 280,
              bottom: -70,
              right: -80,
              backgroundColor: theme.colors.nebulaBlue,
              opacity: 0.18 * a,
              transform: [{ translateX: move(driftB, 8) }, { translateY: move(driftB, 8) }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.blob,
            {
              width: 180,
              height: 180,
              top: '42%',
              right: -60,
              backgroundColor: theme.colors.nebulaPurple,
              opacity: 0.12 * a,
              transform: [{ translateY: move(driftC, 10) }],
            },
          ]}
        />
      </View>

      <Starfield count={STAR_COUNT[variant]} maxOpacity={variant === 'loader' ? 0.7 : 1} />

      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bgDeep,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  content: {
    flex: 1,
  },
});

export const AuroraBackground = memo(AuroraBackgroundBase);
export default AuroraBackground;
