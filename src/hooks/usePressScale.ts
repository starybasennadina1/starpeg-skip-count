import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import theme from '../constants/theme';

/**
 * Rule #8 press-feedback contract: the <Pressable> is the PARENT and drives
 * onPressIn/onPressOut; the <Animated.View> with transform:scale lives INSIDE it.
 */
export function usePressScale(to = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      ...theme.anim.press,
    }).start();
  }, [scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      ...theme.anim.press,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
