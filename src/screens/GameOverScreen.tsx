import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Home, Star } from 'lucide-react-native';
import assets from '../assets';
import AuroraBackground from '../components/AuroraBackground';
import IconTile from '../components/IconTile';
import PrimaryButton from '../components/PrimaryButton';
import ProgressPill from '../components/ProgressPill';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatRow from '../components/StatRow';
import StoryBlock from '../components/StoryBlock';
import { FIGURE_TRACE_MS, SCREEN_H, SHIMMER_MS } from '../constants/config';
import theme from '../constants/theme';
import { animScale } from '../game/settings';
import type { RoundResult } from './GameScreen';

type Props = {
  result: RoundResult;
  mapped: number;
  nextRuleLabel: string;
  onPlayAgain: () => void;
  onMenu: () => void;
};

const ART = Math.round(Math.min(200, SCREEN_H * 0.23));

export default function GameOverScreen({
  result,
  mapped,
  nextRuleLabel,
  onPlayAgain,
  onMenu,
}: Props) {
  const reveal = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const s = Math.max(animScale(), 0.0001);
    Animated.timing(reveal, {
      toValue: 1,
      duration: FIGURE_TRACE_MS * s,
      useNativeDriver: true,
    }).start();

    const ring = Animated.sequence([
      Animated.timing(shimmer, { toValue: 1, duration: SHIMMER_MS * s, useNativeDriver: true }),
      Animated.timing(shimmer, { toValue: 0, duration: 1, useNativeDriver: true }),
      Animated.timing(shimmer, { toValue: 1, duration: SHIMMER_MS * s, useNativeDriver: true }),
    ]);
    ring.start();
    return () => {
      ring.stop();
    };
  }, [reveal, shimmer]);

  const isPractice = result.mode === 'practice';
  const art = isPractice ? assets.sprite4 : assets.sprite2;

  return (
    <AuroraBackground variant="result">
      <ScreenHeader
        title={isPractice ? 'PRACTICE RUN' : 'SKY STORY'}
        subtitle={'CONSTELLATION ' + result.index}
        leftSlot={<IconTile source={assets.iconHome} onPress={onMenu} label="Sky dome" />}
        rightSlot={<ProgressPill value={String(mapped)} label="MAPPED" />}
      />

      <View style={styles.body}>
        <Text style={styles.kicker}>
          {isPractice ? 'RUN COMPLETE' : 'CONSTELLATION COMPLETE'}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {result.figureName}
        </Text>

        <View style={styles.artZone}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.shimmerRing,
              {
                opacity: shimmer.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 0],
                }),
                transform: [
                  {
                    scale: shimmer.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.6],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={{
              opacity: reveal,
              transform: [
                {
                  scale: reveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            }}>
            <Image source={art} style={styles.art} />
          </Animated.View>
        </View>

        <View style={styles.story}>
          <StoryBlock lines={result.story} />
        </View>

        <View style={styles.stats}>
          <StatRow
            items={[
              {
                key: 'stars',
                value: result.stars + '/' + result.stars,
                label: 'STARS',
                valueColor: theme.colors.accent,
                weight: result.stars,
              },
              {
                key: 'acc',
                value: result.accuracy + '%',
                label: 'ACCURACY',
                valueColor: theme.colors.success,
                weight: result.accuracy,
              },
              {
                key: 'mapped',
                value: String(mapped),
                label: 'MAPPED',
                valueColor: theme.colors.primary,
                weight: mapped,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.nextHint}>{'NEXT: ' + nextRuleLabel}</Text>
        <PrimaryButton
          label="MAP AGAIN"
          Icon={Star}
          onPress={onPlayAgain}
          height={60}
          colors={theme.gradients.gold}
          glowColor={theme.colors.accent}
        />
        <View style={styles.secondary}>
          <SecondaryButton label="SKY DOME" Icon={Home} onPress={onMenu} height={48} />
        </View>
      </View>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 4,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.accent,
  },
  name: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text,
    textAlign: 'center',
  },
  artZone: {
    marginTop: 10,
    width: ART,
    height: ART,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shimmerRing: {
    position: 'absolute',
    width: ART * 0.8,
    height: ART * 0.8,
    borderRadius: ART * 0.4,
    borderWidth: 2,
    borderColor: 'rgba(255,209,102,0.7)',
  },
  art: {
    width: ART * 0.92,
    height: ART * 0.92,
    resizeMode: 'contain',
  },
  story: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  stats: {
    marginTop: 16,
    alignSelf: 'stretch',
  },
  footer: {
    paddingHorizontal: 22,
    paddingBottom: 26,
  },
  nextHint: {
    marginBottom: 8,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.primary,
    opacity: 0.8,
    textAlign: 'center',
  },
  secondary: {
    marginTop: 10,
  },
});
