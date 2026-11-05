import React, { memo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';

type Props = {
  /** Animated.Value already interpolated to a pixel width. */
  fillWidth: Animated.AnimatedInterpolation<number> | number;
  width: number;
  height?: number;
  colors?: readonly [string, string];
};

/**
 * Width is NOT a native-driver property — the caller animates it with
 * useNativeDriver:false. Transform/opacity stay on the native driver.
 */
function ProgressBarBase({
  fillWidth,
  width,
  height = 5,
  colors = theme.gradients.bar,
}: Props) {
  return (
    <View
      pointerEvents="none"
      style={[styles.track, { width, height, borderRadius: height / 2 }]}>
      <Animated.View style={{ width: fillWidth, height }}>
        <LinearGradient
          colors={colors as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, borderRadius: height / 2 }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: 'rgba(242,244,255,0.10)',
    overflow: 'hidden',
  },
});

export const ProgressBar = memo(ProgressBarBase);
export default ProgressBar;
