import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line, Polyline } from 'react-native-svg';
import { BOARD_H, BOARD_W } from '../constants/config';
import theme from '../constants/theme';
import type { Point } from '../utils/geometry';

type Props = {
  points: Point[];
  livePoint: Point | null;
  /** the finished figure traces itself in gold before the story screen */
  traced?: boolean;
};

/** Settled polyline + its glow underlay, plus the dashed stretchy segment. */
function ChainLineBase({ points, livePoint, traced = false }: Props) {
  const pts = points.map(p => p.x + ',' + p.y).join(' ');
  const last = points.length > 0 ? points[points.length - 1] : null;
  const stroke = traced ? theme.colors.accent : theme.colors.primary;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={BOARD_W} height={BOARD_H}>
        {points.length > 1 ? (
          <Polyline
            points={pts}
            fill="none"
            stroke={stroke}
            strokeOpacity={0.18}
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
        {points.length > 1 ? (
          <Polyline
            points={pts}
            fill="none"
            stroke={stroke}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
        {last && livePoint ? (
          <Line
            x1={last.x}
            y1={last.y}
            x2={livePoint.x}
            y2={livePoint.y}
            stroke={theme.colors.accent}
            strokeWidth={2.5}
            strokeDasharray="6 5"
            strokeLinecap="round"
            opacity={0.9}
          />
        ) : null}
      </Svg>
    </View>
  );
}

export const ChainLine = memo(ChainLineBase);
export default ChainLine;
