import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import assets from '../assets';
import AuroraBackground from '../components/AuroraBackground';
import IconTile from '../components/IconTile';
import PegBoard from '../components/PegBoard';
import ProgressPill from '../components/ProgressPill';
import RuleCard from '../components/RuleCard';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import WorkedExampleOverlay from '../components/WorkedExampleOverlay';
import {
  FIGURE_TRACE_MS,
  FLOATING_H,
  IDLE_HINT_MS,
  IDLE_REVEAL_MS,
} from '../constants/config';
import theme from '../constants/theme';
import type { Constellation } from '../game/constellations';
import { accuracyOf } from '../game/mastery';
import { ruleShort } from '../game/rules';
import { animScale } from '../game/settings';
import useChain from '../hooks/useChain';

export type RoundResult = {
  figureName: string;
  story: string[];
  table: number;
  stars: number;
  mistakes: number;
  accuracy: number;
  index: number;
  mode: 'figure' | 'practice';
};

type Props = {
  constellation: Constellation;
  onGameOver: (result: RoundResult) => void;
  onPause: () => void;
};

export default function GameScreen({
  constellation,
  onGameOver,
  onPause,
}: Props) {
  const {
    chain,
    mistakes,
    rejects,
    lastRejectedId,
    rejectTick,
    solution,
    nextPegId,
    complete,
    resolve,
    revealAll,
  } = useChain(constellation);

  const [example, setExample] = useState(false);
  const [flashTick, setFlashTick] = useState(0);
  const [traced, setTraced] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const boardIn = useRef(new Animated.Value(0)).current;
  const firedRef = useRef(false);
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  useEffect(() => {
    Animated.spring(boardIn, {
      toValue: 1,
      useNativeDriver: true,
      tension: 55,
      friction: 9,
    }).start();
  }, [boardIn]);

  /** Idle assist: nudge first, then let the sky draw the figure itself. */
  useEffect(() => {
    setShowHint(false);
    const hint = setTimeout(() => setShowHint(true), IDLE_HINT_MS);
    return () => clearTimeout(hint);
  }, [chain.length]);

  useEffect(() => {
    if (complete) {
      return;
    }
    const t = setTimeout(revealAll, IDLE_REVEAL_MS);
    return () => clearTimeout(t);
  }, [chain.length, complete, revealAll]);

  const handleResolve = useCallback(
    (pegId: number) => {
      const outcome = resolve(pegId);
      if (outcome === 'reject') {
        setFlashTick(t => t + 1);
      }
    },
    [resolve],
  );

  /** After a second miss on the same step, open the worked example. */
  useEffect(() => {
    if (rejects === 2) {
      setExample(true);
    }
  }, [rejects]);

  /** Completion: trace the figure, then hand the round to App. */
  useEffect(() => {
    if (!complete || firedRef.current) {
      return;
    }
    firedRef.current = true;
    setTraced(true);
    setExample(false);
    const stars = solution.length;
    const t = setTimeout(
      () =>
        onGameOverRef.current({
          figureName: constellation.name,
          story: constellation.story,
          table: constellation.table,
          stars,
          mistakes,
          accuracy: accuracyOf(stars, mistakes),
          index: constellation.index,
          mode: 'figure',
        }),
      Math.max(FIGURE_TRACE_MS * animScale(), 220),
    );
    return () => clearTimeout(t);
  }, [complete, constellation, mistakes, solution.length]);

  const hintPegId = showHint && !complete ? nextPegId : null;

  return (
    <AuroraBackground variant="game">
      <ScreenHeader
        title={'CONSTELLATION ' + constellation.index}
        subtitle={ruleShort(constellation.rule)}
        leftSlot={
          <IconTile source={assets.iconPause} onPress={onPause} label="Pause" />
        }
        rightSlot={
          <ProgressPill
            value={chain.length + ' / ' + solution.length}
            label="STARS"
          />
        }
      />

      <View style={styles.area}>
        <Animated.View
          pointerEvents="box-none"
          style={{
            opacity: boardIn,
            transform: [
              {
                scale: boardIn.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.94, 1],
                }),
              },
            ],
          }}>
          <PegBoard
            constellation={constellation}
            chain={chain}
            hintPegId={hintPegId}
            lastRejectedId={lastRejectedId}
            rejectTick={rejectTick}
            traced={traced}
            enabled={!complete && !example}
            onResolve={handleResolve}
          />
        </Animated.View>
      </View>

      <View style={styles.floating} pointerEvents="box-none">
        <RuleCard rule={constellation.rule} flashTick={flashTick} />
        <View style={styles.controls}>
          <SecondaryButton label="SHOW EXAMPLE" onPress={() => setExample(true)} flex />
          <SecondaryButton
            label="REVEAL"
            onPress={revealAll}
            width={108}
            tint={theme.colors.accent}
          />
        </View>
      </View>

      <WorkedExampleOverlay
        rule={constellation.rule}
        visible={example}
        onClose={() => setExample(false)}
      />
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: FLOATING_H + 24,
  },
  floating: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
  },
  controls: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
});
