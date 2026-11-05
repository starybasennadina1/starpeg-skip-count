import React, { memo } from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import { starField } from '../constants/stars';

type Props = {
  count: number;
  seed?: number;
  tint?: string;
  maxOpacity?: number;
};

const pct = (v: number): DimensionValue => (v * 100).toFixed(3) + '%' as DimensionValue;

/** Seeded, memoised dot field. Pure decoration — never interactive. */
function StarfieldBase({ count, seed, tint = '#F2F4FF', maxOpacity = 1 }: Props) {
  const stars = starField(count, seed);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((s, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: pct(s.x),
            top: pct(s.y),
            width: s.r * 2,
            height: s.r * 2,
            borderRadius: s.r,
            backgroundColor: tint,
            opacity: Math.min(s.o, maxOpacity),
          }}
        />
      ))}
    </View>
  );
}

export const Starfield = memo(StarfieldBase);
export default Starfield;
