import React, { memo, useMemo, useRef, useState } from 'react';
import {
  PanResponder,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type PanResponderGestureState,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  BOARD_H,
  BOARD_W,
  SNAP_RADIUS,
  STARS_BOARD,
  TAP_TRAVEL_PX,
} from '../constants/config';
import theme from '../constants/theme';
import type { Constellation } from '../game/constellations';
import { cellCentre, nearest, type Point } from '../utils/geometry';
import ChainLine from './ChainLine';
import Starfield from './Starfield';
import StarPeg from './StarPeg';

type Props = {
  constellation: Constellation;
  chain: number[];
  hintPegId: number | null;
  lastRejectedId: number | null;
  rejectTick: number;
  traced: boolean;
  enabled: boolean;
  onResolve: (pegId: number) => void;
};

type Placed = { id: number; value: number; centre: Point };

/**
 * Input is a single core-RN PanResponder (no third-party gesture library is
 * allowed on this stack). It serves both dragging and plain tapping, so a
 * child who cannot drag can still solve the puzzle by tapping star to star.
 */
function PegBoardBase({
  constellation,
  chain,
  hintPegId,
  lastRejectedId,
  rejectTick,
  traced,
  enabled,
  onResolve,
}: Props) {
  const placed: Placed[] = useMemo(
    () =>
      constellation.pegs.map(p => ({
        id: p.id,
        value: p.value,
        centre: cellCentre(p.col, p.row),
      })),
    [constellation],
  );

  const [live, setLive] = useState<Point | null>(null);

  // Per-frame data lives in refs so moving a finger never re-renders the pegs.
  const originRef = useRef<{ px: number; py: number; lx: number; ly: number } | null>(null);
  const visitedRef = useRef<Set<number>>(new Set());
  const lastEmitRef = useRef(0);
  const enabledRef = useRef(enabled);
  const placedRef = useRef(placed);
  const onResolveRef = useRef(onResolve);

  enabledRef.current = enabled;
  placedRef.current = placed;
  onResolveRef.current = onResolve;

  const pointOf = (g: PanResponderGestureState): Point => {
    const o = originRef.current;
    if (!o) {
      return { x: 0, y: 0 };
    }
    return { x: o.lx + (g.moveX - o.px), y: o.ly + (g.moveY - o.py) };
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: (e: GestureResponderEvent) => {
        const n = e.nativeEvent;
        originRef.current = { px: n.pageX, py: n.pageY, lx: n.locationX, ly: n.locationY };
        visitedRef.current = new Set();
        if (enabledRef.current) {
          setLive({ x: n.locationX, y: n.locationY });
        }
      },

      onPanResponderMove: (_e, g) => {
        if (!enabledRef.current) {
          return;
        }
        const p = pointOf(g);
        const now = Date.now();
        if (now - lastEmitRef.current > 40) {
          lastEmitRef.current = now;
          setLive(p);
        }
        const hit = nearest<Placed>(placedRef.current, p, SNAP_RADIUS);
        if (hit && !visitedRef.current.has(hit.id)) {
          visitedRef.current.add(hit.id);
          onResolveRef.current(hit.id);
        }
      },

      onPanResponderRelease: (_e, g) => {
        const travel = Math.abs(g.dx) + Math.abs(g.dy);
        if (enabledRef.current && travel < TAP_TRAVEL_PX) {
          const p = pointOf(g);
          const hit = nearest<Placed>(placedRef.current, p, SNAP_RADIUS);
          if (hit) {
            onResolveRef.current(hit.id);
          }
        }
        originRef.current = null;
        setLive(null);
      },

      onPanResponderTerminate: () => {
        originRef.current = null;
        setLive(null);
      },
    }),
  ).current;

  const linePoints = useMemo(() => {
    const byId: Record<number, Point> = {};
    placed.forEach(p => {
      byId[p.id] = p.centre;
    });
    return chain.map(id => byId[id]).filter(Boolean);
  }, [chain, placed]);

  const livePoint = chain.length > 0 ? live : null;

  return (
    <View style={styles.board} {...responder.panHandlers}>
      <LinearGradient
        colors={theme.gradients.board as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.surface}
      />
      <View style={styles.inner} pointerEvents="none">
        <Starfield count={STARS_BOARD} seed={constellation.id * 7717} maxOpacity={0.6} />
      </View>

      <ChainLine points={linePoints} livePoint={livePoint} traced={traced} />

      {placed.map(p => {
        const order = chain.indexOf(p.id);
        return (
          <StarPeg
            key={p.id}
            value={p.value}
            centre={p.centre}
            lit={order >= 0}
            order={order < 0 ? 0 : order}
            hint={hintPegId === p.id}
            shakeTick={lastRejectedId === p.id ? rejectTick : 0}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: BOARD_W,
    height: BOARD_H,
  },
  surface: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(142,168,255,0.20)',
  },
  inner: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    overflow: 'hidden',
  },
});

export const PegBoard = memo(PegBoardBase);
export default PegBoard;
