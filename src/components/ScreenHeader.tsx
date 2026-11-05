import React, { memo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  /** Menu uses the transparent variant so the sky dome bleeds to the top. */
  transparent?: boolean;
};

/**
 * One header for every screen (Menu, Game, GameOver, Star Log, Practice,
 * Parent Corner) — different slots, identical styling. paddingTop 44 keeps
 * the content clear of the status bar.
 */
function ScreenHeaderBase({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  transparent = false,
}: Props) {
  return (
    <View style={[styles.header, transparent ? styles.transparent : styles.solid]}>
      <View style={styles.side}>{leftSlot}</View>

      <View style={styles.centre}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 44,
    height: 116,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  solid: {
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(142,168,255,0.18)',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  side: {
    minWidth: 44,
    maxWidth: 136,
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.accent,
  },
});

export const ScreenHeader = memo(ScreenHeaderBase);
export default ScreenHeader;
