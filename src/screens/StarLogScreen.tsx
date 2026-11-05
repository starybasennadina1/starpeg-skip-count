import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import assets from '../assets';
import AuroraBackground from '../components/AuroraBackground';
import ConstellationTile from '../components/ConstellationTile';
import IconTile from '../components/IconTile';
import ProgressPill from '../components/ProgressPill';
import ScreenHeader from '../components/ScreenHeader';
import { SCREEN_W } from '../constants/config';
import theme from '../constants/theme';
import { LOG_ENTRIES } from '../game/constellations';

type Props = {
  mapped: number;
  onBack: () => void;
};

const GAP = 10;
const CELL_W = Math.floor((Math.min(SCREEN_W, 480) - 32 - GAP * 2) / 3);

export default function StarLogScreen({ mapped, onBack }: Props) {
  const renderItem = useCallback(
    ({ item, index }: { item: { id: number; name: string }; index: number }) => (
      <ConstellationTile
        name={item.name}
        discovered={index < mapped}
        size={CELL_W}
        onPress={onBack}
      />
    ),
    [mapped, onBack],
  );

  return (
    <AuroraBackground variant="panel">
      <ScreenHeader
        title="STAR LOG"
        subtitle="DISCOVERED FIGURES"
        leftSlot={<IconTile source={assets.iconHome} onPress={onBack} label="Back" />}
        rightSlot={<ProgressPill value={String(mapped)} label="FOUND" />}
      />

      <FlatList
        data={LOG_ENTRIES}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={9}
        windowSize={5}
        ListHeaderComponent={
          <Text style={styles.caption}>
            TAP A FIGURE TO RETURN TO THE SKY DOME
          </Text>
        }
        ListFooterComponent={<View style={styles.footerSpace} />}
      />
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  column: {
    gap: GAP,
    marginBottom: GAP,
  },
  caption: {
    marginBottom: 14,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.primary,
    opacity: 0.7,
  },
  footerSpace: {
    height: 24,
  },
});
