import React, { memo } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text } from 'react-native';
import assets from '../assets';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

type Props = {
  name: string;
  discovered: boolean;
  size: number;
  onPress: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function ConstellationTileBase({ name, discovered, size, onPress }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={discovered ? name : 'Undiscovered constellation'}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={{ width: size, height: size }}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.tile,
          discovered ? styles.found : styles.hidden,
          { transform: [{ scale }] },
        ]}>
        {discovered ? (
          <>
            <Image
              source={assets.sprite3}
              style={{
                width: size * 0.52,
                height: size * 0.52,
                resizeMode: 'contain',
              }}
            />
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
          </>
        ) : (
          <Text style={styles.locked}>?</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    gap: 4,
  },
  found: {
    backgroundColor: 'rgba(43,55,104,0.55)',
    borderColor: 'rgba(142,168,255,0.28)',
  },
  hidden: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(142,168,255,0.12)',
  },
  name: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.text,
  },
  locked: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
    opacity: 0.4,
  },
});

export const ConstellationTile = memo(ConstellationTileBase);
export default ConstellationTile;
