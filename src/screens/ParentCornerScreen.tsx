import React, { useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type DimensionValue,
} from 'react-native';
import assets from '../assets';
import AuroraBackground from '../components/AuroraBackground';
import IconTile from '../components/IconTile';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import SettingRow from '../components/SettingRow';
import ToggleSwitch from '../components/ToggleSwitch';
import theme from '../constants/theme';
import type { Mastery } from '../game/mastery';
import { setSetting, useSetting } from '../game/settings';
import usePressScale from '../hooks/usePressScale';

type Props = {
  mastery: Mastery;
  onBack: () => void;
  onReset: () => void;
};

const GRADES: Array<'G1' | 'G2' | 'G3'> = ['G1', 'G2', 'G3'];
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const RESET_GRADIENT = ['#E58A5C', '#C9663A'] as const;
const pct = (v: number): DimensionValue => v + '%' as DimensionValue;

function GradeChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);
  const tint = active ? theme.colors.accent : theme.colors.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'Grade ' + label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={styles.gradeSlot}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.grade,
          {
            borderColor: tint + '55',
            backgroundColor: active
              ? 'rgba(255,209,102,0.16)'
              : 'rgba(142,168,255,0.10)',
            transform: [{ scale }],
          },
        ]}>
        <Text style={[styles.gradeText, { color: tint }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function ParentCornerScreen({ mastery, onBack, onReset }: Props) {
  const grade = useSetting('grade');
  const sound = useSetting('sound');
  const reduced = useSetting('reducedMotion');
  const [confirming, setConfirming] = useState(false);

  const tables = Object.keys(mastery)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <AuroraBackground variant="panel">
      <ScreenHeader
        title="PARENT CORNER"
        subtitle="PROGRESS CHART"
        leftSlot={<IconTile source={assets.iconHome} onPress={onBack} label="Back" />}
      />

      <View style={styles.body}>
        <View style={styles.chart}>
          <Text style={styles.chartTitle}>MASTERY BY TABLE</Text>
          {tables.length > 0 ? (
            tables.map(t => (
              <View key={t} style={styles.barRow}>
                <Text style={styles.barLabel}>{'x' + t}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: pct(mastery[t] || 0),
                        backgroundColor:
                          (mastery[t] || 0) >= 60
                            ? theme.colors.success
                            : theme.colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barValue}>{mastery[t] || 0}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>NO RUNS RECORDED YET</Text>
          )}
        </View>

        <View style={styles.rows}>
          <SettingRow label="GRADE LEVEL" hint="Picks the rule family">
            <View style={styles.grades}>
              {GRADES.map(g => (
                <GradeChip
                  key={g}
                  label={g}
                  active={grade === g}
                  onPress={() => setSetting('grade', g)}
                />
              ))}
            </View>
          </SettingRow>

          <SettingRow label="SOUND" hint="Chimes on a correct star">
            <ToggleSwitch
              value={sound}
              onChange={v => setSetting('sound', v)}
              label="Sound"
            />
          </SettingRow>

          <SettingRow label="REDUCED MOTION" hint="Stops every loop and drift">
            <ToggleSwitch
              value={reduced}
              onChange={v => setSetting('reducedMotion', v)}
              label="Reduced motion"
            />
          </SettingRow>
        </View>

        <View style={styles.footer}>
          <SecondaryButton
            label="RESET PROGRESS"
            onPress={() => setConfirming(true)}
            height={52}
            tint={theme.colors.warn}
          />
        </View>
      </View>

      {confirming ? (
        <View style={styles.backdrop}>
          <View style={styles.confirm}>
            <Text style={styles.confirmTitle}>RESET EVERYTHING?</Text>
            <Text style={styles.confirmBody}>
              Every mapped figure and every mastery bar goes back to zero.
            </Text>
            <PrimaryButton
              label="YES, RESET"
              onPress={() => {
                setConfirming(false);
                onReset();
              }}
              height={52}
              colors={RESET_GRADIENT}
              glowColor={theme.colors.warn}
              textColor={theme.colors.text}
            />
            <View style={styles.confirmCancel}>
              <SecondaryButton
                label="KEEP MY STARS"
                onPress={() => setConfirming(false)}
                height={48}
              />
            </View>
          </View>
        </View>
      ) : null}
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 26,
  },
  chart: {
    borderRadius: 20,
    backgroundColor: 'rgba(27,38,86,0.62)',
    borderWidth: 1,
    borderColor: 'rgba(142,168,255,0.20)',
    padding: 16,
  },
  chartTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.6,
    color: theme.colors.accent,
    marginBottom: 12,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  barLabel: {
    width: 26,
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(242,244,255,0.08)',
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  barValue: {
    width: 30,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  empty: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: theme.colors.textMuted,
  },
  rows: {
    marginTop: 16,
    gap: 10,
  },
  grades: {
    flexDirection: 'row',
    gap: 6,
  },
  gradeSlot: {
    width: 44,
    height: 36,
  },
  grade: {
    width: '100%',
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  footer: {
    marginTop: 'auto',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4,8,26,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  confirm: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 22,
    backgroundColor: 'rgba(16,24,58,0.98)',
    borderWidth: 1,
    borderColor: 'rgba(229,138,92,0.45)',
    padding: 20,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.text,
  },
  confirmBody: {
    marginTop: 8,
    marginBottom: 18,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  confirmCancel: {
    marginTop: 10,
  },
});
