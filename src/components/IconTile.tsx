import React, { memo } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  type ImageSourcePropType,
} from 'react-native';
import usePressScale from '../hooks/usePressScale';

type Props = {
  source: ImageSourcePropType;
  onPress: () => void;
  label: string;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const TILE = 44;

/** 44x44 navigation tile carrying one of the fixed PNG glyphs. */
function IconTileBase({ source, onPress, label }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.92);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.tile, { transform: [{ scale }] }]}>
        <Image source={source} style={styles.glyph} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: TILE,
    height: TILE,
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(142,168,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export const IconTile = memo(IconTileBase);
export default IconTile;
