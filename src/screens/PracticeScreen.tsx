import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import assets from '../assets';
import AuroraBackground from '../components/AuroraBackground';
import IconTile from '../components/IconTile';
import ProgressPill from '../components/ProgressPill';
import ScreenHeader from '../components/ScreenHeader';
import { PRACTICE_QUESTIONS } from '../constants/config';
import theme from '../constants/theme';
import { accuracyOf } from '../game/mastery';
import { animScale } from '../game/settings';
import usePressScale from '../hooks/usePressScale';
import type { RoundResult } from './GameScreen';

type Props = {
  table: number;
  onFinish: (result: RoundResult) => void;
  onBack: () => void;
};

type Question = { a: number; b: number; answers: number[]; correct: number };

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function buildQuestions(table: number): Question[] {
  const out: Question[] = [];
  for (let i = 0; i < PRACTICE_QUESTIONS; i++) {
    const b = (i % 9) + 2;
    const correct = table * b;
    const pool = [correct, correct + table, Math.max(1, correct - table), correct + 1];
    // deterministic shuffle so a re-render never reorders the buttons
    const answers = pool
      .map((v, idx) => ({ v, k: (idx * 7 + i * 3) % 11 }))
      .sort((x, y) => x.k - y.k)
      .map(x => x.v);
    out.push({ a: table, b, answers, correct });
  }
  return out;
}

function AnswerButton({
  value,
  state,
  onPress,
}: {
  value: number;
  state: 'idle' | 'right' | 'wrong';
  onPress: () => void;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);
  const tint =
    state === 'right'
      ? theme.colors.accent
      : state === 'wrong'
      ? theme.colors.warn
      : theme.colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'Answer ' + value}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={styles.answerSlot}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.answer,
          {
            borderColor: tint + '55',
            backgroundColor:
              state === 'right' ? 'rgba(255,209,102,0.22)' : 'rgba(142,168,255,0.12)',
            transform: [{ scale }],
          },
        ]}>
        <Text style={[styles.answerText, { color: tint }]}>{value}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function PracticeScreen({ table, onFinish, onBack }: Props) {
  const questions = useMemo(() => buildQuestions(table), [table]);
  const [index, setIndex] = useState(0);
  const [misses, setMisses] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const shake = useRef(new Animated.Value(0)).current;
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const q = questions[Math.min(index, questions.length - 1)];

  const answer = useCallback(
    (value: number) => {
      if (picked !== null) {
        return;
      }
      if (value === q.correct) {
        setPicked(value);
        setTimeout(() => {
          setPicked(null);
          if (index + 1 >= PRACTICE_QUESTIONS) {
            const stars = PRACTICE_QUESTIONS;
            onFinishRef.current({
              figureName: 'TIMES TABLE OF ' + table,
              story: [
                'Ten questions, answered under an open sky.',
                'Every number you keep is one more star',
                'that will be waiting when you come back.',
              ],
              table,
              stars,
              mistakes: misses,
              accuracy: accuracyOf(stars, misses),
              index: 0,
              mode: 'practice',
            });
          } else {
            setIndex(i => i + 1);
          }
        }, 320);
        return;
      }
      setMisses(m => m + 1);
      if (animScale() === 0) {
        return;
      }
      shake.setValue(0);
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 70, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 70, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 70, useNativeDriver: true }),
      ]).start();
    },
    [index, misses, picked, q.correct, shake, table],
  );

  return (
    <AuroraBackground variant="panel">
      <ScreenHeader
        title="RULE PRACTICE"
        subtitle={'TABLE OF ' + table}
        leftSlot={<IconTile source={assets.iconHome} onPress={onBack} label="Back" />}
        rightSlot={
          <ProgressPill
            value={index + 1 + ' / ' + PRACTICE_QUESTIONS}
            label="ASKED"
          />
        }
      />

      <View style={styles.body}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                {
                  translateX: shake.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [-6, 0, 6],
                  }),
                },
              ],
            },
          ]}>
          <View style={styles.cardBar} />
          <Text style={styles.question}>{q.a + ' x ' + q.b}</Text>
          <Image source={assets.sprite4} style={styles.badge} />
        </Animated.View>

        <View style={styles.grid}>
          {q.answers.map(v => (
            <AnswerButton
              key={v}
              value={v}
              state={picked === null ? 'idle' : v === q.correct ? 'right' : 'idle'}
              onPress={() => answer(v)}
            />
          ))}
        </View>

        <Text style={styles.hint}>A WRONG ANSWER NEVER TAKES A STAR AWAY</Text>
      </View>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    justifyContent: 'center',
  },
  card: {
    height: 150,
    borderRadius: 24,
    backgroundColor: 'rgba(27,38,86,0.70)',
    borderWidth: 1,
    borderColor: 'rgba(142,168,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardBar: {
    position: 'absolute',
    left: 0,
    top: 24,
    bottom: 24,
    width: 4,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: theme.colors.accent,
  },
  question: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  badge: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 46,
    height: 46,
    resizeMode: 'contain',
    opacity: 0.75,
  },
  grid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  answerSlot: {
    width: '47%',
    height: 64,
    flexGrow: 1,
  },
  answer: {
    width: '100%',
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    marginTop: 18,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.primary,
    opacity: 0.7,
    textAlign: 'center',
  },
});
