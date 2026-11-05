import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import AuroraBackground from '../components/AuroraBackground';
import BrandMark from '../components/BrandMark';
import ProgressBar from '../components/ProgressBar';
import { LOADER_DURATION_MS, LOADER_FADE_MS } from '../constants/config';
import theme from '../constants/theme';

type Props = {
  onDone: () => void;
};

const BAR_W = 200;

/**
 * Deliberately far darker than the Menu (rule #14): non-interactive brand card
 * — no chips, no buttons, no stat cards. Just the brand mark, the title and
 * the 8s progress bar; the transition to Menu is the setTimeout below.
 */
export default function LoaderScreen({ onDone }: Props) {
  const fade = useRef(new Animated.Value(1)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const title = useRef(new Animated.Value(0)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    // width is NOT a native-driver property
    const run = Animated.timing(bar, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    run.start();

    Animated.timing(title, {
      toValue: 1,
      duration: 600,
      delay: 180,
      useNativeDriver: true,
    }).start();

    const t = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        useNativeDriver: true,
      }).start(() => doneRef.current());
    }, LOADER_DURATION_MS);

    return () => {
      clearTimeout(t);
      run.stop();
    };
  }, [bar, fade, title]);

  const fillWidth = bar.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_W],
  });

  return (
    <Animated.View style={[styles.root, { opacity: fade }]}>
      <AuroraBackground variant="loader">
        <View style={styles.body}>
          <BrandMark size={176} />

          <Animated.View
            style={[
              styles.titleWrap,
              {
                opacity: title,
                transform: [
                  {
                    translateY: title.interpolate({
                      inputRange: [0, 1],
                      outputRange: [14, 0],
                    }),
                  },
                ],
              },
            ]}>
            <Text style={styles.brand}>STARPEG</Text>
            <Text style={styles.brandSub}>SKIP COUNT</Text>
            <Text style={styles.tagline}>LINK THE STARS. LEARN THE TABLES.</Text>
          </Animated.View>

          <View style={styles.barWrap}>
            <ProgressBar fillWidth={fillWidth} width={BAR_W} height={5} />
            <Text style={styles.loading}>LOADING THE NIGHT SKY</Text>
          </View>
        </View>
      </AuroraBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bgInk,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  titleWrap: {
    marginTop: 34,
    alignItems: 'center',
  },
  brand: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 5,
    color: theme.colors.text,
    textShadowColor: 'rgba(142,168,255,0.55)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  brandSub: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 7,
    color: theme.colors.accent,
    textShadowColor: 'rgba(255,209,102,0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  tagline: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.4,
    color: theme.colors.primary,
    opacity: 0.85,
  },
  barWrap: {
    marginTop: 54,
    alignItems: 'center',
  },
  loading: {
    marginTop: 14,
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 3,
    color: theme.colors.primary,
    opacity: 0.6,
  },
});
