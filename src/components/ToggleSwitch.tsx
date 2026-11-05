import React, { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import theme from '../constants/theme';
import { animScale } from '../game/settings';

type Props = {
  value: boolean;
  onChange: (next: boolean) => void;
  label: string;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const W = 56;
const H = 32;
const KNOB = 24;

/** Pure Animated track + knob — no native switch dependency. */
function ToggleSwitchBase({ value, onChange, label }: Props) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180 * Math.max(animScale(), 0.0001),
      useNativeDriver: true,
    }).start();
  }, [value, anim]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      hitSlop={HIT}
      style={styles.press}>
      <View style={styles.track}>
        <Animated.View style={[styles.trackOn, { opacity: anim }]} />
        <Animated.View
          style={[
            styles.knob,
            {
              transform: [
                {
                  translateX: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, W - KNOB - 8],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: W,
    height: H,
  },
  track: {
    width: W,
    height: H,
    borderRadius: H / 2,
    backgroundColor: 'rgba(142,168,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(142,168,255,0.28)',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  trackOn: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: H / 2,
    backgroundColor: 'rgba(255,209,102,0.30)',
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: theme.colors.text,
  },
});

export const ToggleSwitch = memo(ToggleSwitchBase);
export default ToggleSwitch;
