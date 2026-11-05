import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { BarChart3, BookOpen, Calculator, Star } from 'lucide-react-native';
import assets from '../assets';
import AuroraBackground from '../components/AuroraBackground';
import Chip from '../components/Chip';
import IconTile from '../components/IconTile';
import PrimaryButton from '../components/PrimaryButton';
import ProgressPill from '../components/ProgressPill';
import ScreenHeader from '../components/ScreenHeader';
import StatRow from '../components/StatRow';
import { SCREEN_W } from '../constants/config';
import theme from '../constants/theme';
import type { Constellation } from '../game/constellations';
import { ruleTitle } from '../game/rules';
import { animScale } from '../game/settings';
import type { Progress } from '../hooks/useProgress';

type Props = {
  progress: Progress;
  next: Constellation;
  onPlay: () => void;
  onStarLog: () => void;
  onPractice: () => void;
  onParent: () => void;
};

const DOME = 300;
/** Hand-placed dome figure, drawn in the Svg's own 300x300 space. */
const DOME_POINTS = [
  { x: 56, y: 214 },
  { x: 108, y: 126 },
  { x: 150, y: 44 },
  { x: 206, y: 118 },
  { x: 250, y: 202 },
];
const SOLVED = 3;

const CHIP_GAP = 8;
const SHEET_PAD = 20;
const CHIP_W = Math.floor((Math.min(SCREEN_W, 480) - SHEET_PAD * 2 - CHIP_GAP * 2) / 3);

export default function MenuScreen({
  progress,
  next,
  onPlay,
  onStarLog,
  onPractice,
  onParent,
}: Props) {
  const sheet = useRef(new Animated.Value(0)).current;
  const dome = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const s = Math.max(animScale(), 0.0001);
    Animated.parallel([
      Animated.spring(sheet, { toValue: 1, useNativeDriver: true, ...theme.anim.entry }),
      Animated.timing(dome, { toValue: 1, duration: 500 * s, useNativeDriver: true }),
    ]).start();
  }, [sheet, dome]);

  useEffect(() => {
    if (animScale() === 0) {
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [breathe]);

  return (
    <AuroraBackground variant="menu">
      <ScreenHeader
        transparent
        title="STARPEG"
        subtitle="SKIP COUNT"
        leftSlot={
          <IconTile source={assets.iconHome} onPress={onParent} label="Parent corner" />
        }
        rightSlot={
          <ProgressPill
            value={progress.mapped + ' / ' + progress.total}
            label="MAPPED"
          />
        }
      />

      <View style={styles.domeZone}>
        <Animated.View
          style={[
            styles.dome,
            {
              opacity: dome,
              transform: [
                {
                  scale: breathe.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.03],
                  }),
                },
              ],
            },
          ]}>
          <Svg width={DOME} height={DOME} style={StyleSheet.absoluteFill}>
            <Polyline
              points={DOME_POINTS.map(p => p.x + ',' + p.y).join(' ')}
              fill="none"
              stroke={theme.colors.primary}
              strokeOpacity={0.5}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            {DOME_POINTS.map((p, i) =>
              i < SOLVED ? (
                <Circle key={i} cx={p.x} cy={p.y} r={5} fill={theme.colors.accent} />
              ) : (
                <Circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={5}
                  fill="none"
                  stroke={theme.colors.primary}
                  strokeOpacity={0.4}
                  strokeWidth={1.5}
                />
              ),
            )}
          </Svg>

          <Image source={assets.sprite1} style={styles.figure} />
          <Image source={assets.sprite5} style={styles.comet} />
          <Image source={assets.sprite4} style={styles.farA} />
          <Image source={assets.sprite3} style={styles.farB} />
        </Animated.View>
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={{
          transform: [
            {
              translateY: sheet.interpolate({
                inputRange: [0, 1],
                outputRange: [56, 0],
              }),
            },
          ],
        }}>
        <LinearGradient
          colors={theme.gradients.sheet as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.sheet}>
          <Text style={styles.sheetTitle}>SKY DOME</Text>
          <Text style={styles.sheetTag}>
            {'CHAPTER ' + progress.chapter + ' · ' + ruleTitle(next.rule)}
          </Text>

          <View style={styles.chips}>
            <Chip label="STAR LOG" Icon={BookOpen} onPress={onStarLog} width={CHIP_W} />
            <Chip label="PRACTICE" Icon={Calculator} onPress={onPractice} width={CHIP_W} />
            <Chip label="CHART" Icon={BarChart3} onPress={onParent} width={CHIP_W} />
          </View>

          <Text style={styles.hint}>DRAG FROM STAR TO STAR IN ORDER</Text>

          <PrimaryButton label="START MAPPING" Icon={Star} onPress={onPlay} height={62} />

          <View style={styles.stats}>
            <StatRow
              items={[
                {
                  key: 'acc',
                  value: progress.accuracy + '%',
                  label: 'ACCURACY',
                  valueColor: theme.colors.accent,
                  weight: progress.accuracy,
                },
                {
                  key: 'tab',
                  value: String(progress.tables),
                  label: 'TABLES',
                  valueColor: theme.colors.success,
                  weight: progress.tables,
                },
              ]}
            />
          </View>
        </LinearGradient>
      </Animated.View>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  domeZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dome: {
    width: DOME,
    height: DOME,
    alignItems: 'center',
    justifyContent: 'center',
  },
  figure: {
    width: 190,
    height: 190,
    resizeMode: 'contain',
    opacity: 0.95,
  },
  comet: {
    position: 'absolute',
    right: 10,
    top: 12,
    width: 64,
    height: 64,
    resizeMode: 'contain',
    opacity: 0.9,
  },
  farA: {
    position: 'absolute',
    left: 12,
    top: 20,
    width: 40,
    height: 40,
    resizeMode: 'contain',
    opacity: 0.45,
  },
  farB: {
    position: 'absolute',
    left: 18,
    bottom: 14,
    width: 44,
    height: 44,
    resizeMode: 'contain',
    opacity: 0.5,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(142,168,255,0.22)',
    paddingHorizontal: SHEET_PAD,
    paddingTop: 20,
    paddingBottom: 26,
    shadowColor: '#8EA8FF',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },
  sheetTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 3,
    color: theme.colors.text,
  },
  sheetTag: {
    marginTop: 5,
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 1.8,
    color: theme.colors.primary,
  },
  chips: {
    marginTop: 16,
    flexDirection: 'row',
    gap: CHIP_GAP,
  },
  hint: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.primary,
    opacity: 0.75,
  },
  stats: {
    marginTop: 14,
  },
});
