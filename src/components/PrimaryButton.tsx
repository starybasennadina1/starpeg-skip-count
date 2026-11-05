import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

export type IconComponent = (props: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) => React.ReactElement | null;

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  colors?: readonly [string, string];
  textColor?: string;
  height?: number;
  width?: number | '100%';
  glowColor?: string;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
/** Rule #20 — icon box is always exactly 24, label lineHeight matches it. */
const ICON = 24;

function PrimaryButtonBase({
  label,
  onPress,
  Icon,
  colors = theme.gradients.cta,
  textColor = theme.colors.bg,
  height = 62,
  width = '100%',
  glowColor = theme.colors.primary,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={{ width, height }}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.shell,
          {
            height,
            borderRadius: 18,
            shadowColor: glowColor,
            transform: [{ scale }],
          },
          theme.glow.primary,
        ]}>
        <LinearGradient
          colors={colors as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.fill, { height, borderRadius: 18 }]}>
          <View style={styles.row}>
            {Icon ? (
              <View style={styles.iconBox}>
                <Icon size={ICON} color={textColor} strokeWidth={2.4} />
              </View>
            ) : null}
            <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
  },
  fill: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconBox: {
    width: ICON,
    height: ICON,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 2.4,
    lineHeight: ICON,
  },
});

export const PrimaryButton = memo(PrimaryButtonBase);
export default PrimaryButton;
