import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useAnimScale } from '../game/settings';

/**
 * Looping 0 -> 1 -> 0 driver for the nebula drift / dome breathe / twinkle.
 * Under reduced motion the loop is skipped and the value rests at 0.
 */
export function useDrift(duration = 6000, delay = 0): Animated.Value {
  const value = useRef(new Animated.Value(0)).current;
  const scale = useAnimScale();

  useEffect(() => {
    if (scale === 0) {
      value.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(value, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [value, duration, delay, scale]);

  return value;
}

export default useDrift;
