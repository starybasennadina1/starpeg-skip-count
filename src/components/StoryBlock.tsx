import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import theme from '../constants/theme';
import { animScale } from '../game/settings';

type Props = {
  lines: string[];
};

/** Invented sky-lore, one line at a time. */
function StoryBlockBase({ lines }: Props) {
  const fades = useRef(lines.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const s = Math.max(animScale(), 0.0001);
    Animated.stagger(
      380 * s,
      fades.map(f =>
        Animated.timing(f, {
          toValue: 1,
          duration: 420 * s,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [fades]);

  return (
    <>
      {lines.map((line, i) => (
        <Animated.Text key={line} style={[styles.line, { opacity: fades[i] }]}>
          {line}
        </Animated.Text>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  line: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    color: theme.colors.text,
    opacity: 0.9,
    textAlign: 'center',
  },
});

export const StoryBlock = memo(StoryBlockBase);
export default StoryBlock;
