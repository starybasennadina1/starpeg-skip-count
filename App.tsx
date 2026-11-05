/**
 * StarpegSkipCount — state machine only. No gameplay lives here.
 */
import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import theme from './src/constants/theme';
import { CONSTELLATIONS, constellationAt } from './src/game/constellations';
import { ruleTitle } from './src/game/rules';
import useProgress from './src/hooks/useProgress';
import GameOverScreen from './src/screens/GameOverScreen';
import GameScreen, { type RoundResult } from './src/screens/GameScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import ParentCornerScreen from './src/screens/ParentCornerScreen';
import PracticeScreen from './src/screens/PracticeScreen';
import StarLogScreen from './src/screens/StarLogScreen';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'gameover'
  | 'starlog'
  | 'practice'
  | 'parent';

export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [figureIndex, setFigureIndex] = useState(0);
  const [result, setResult] = useState<RoundResult | null>(null);
  const { progress, recordFigure, reset } = useProgress();

  const constellation = constellationAt(figureIndex);
  const nextConstellation = constellationAt(figureIndex + 1);

  const handleGameOver = useCallback(
    (r: RoundResult) => {
      recordFigure(r.table, r.mistakes, r.accuracy);
      setResult(r);
      setScreen('gameover');
    },
    [recordFigure],
  );

  const handlePlayAgain = useCallback(() => {
    setFigureIndex(i => (i + 1) % CONSTELLATIONS.length);
    setScreen('game');
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {screen === 'loader' ? (
        <LoaderScreen onDone={() => setScreen('menu')} />
      ) : null}

      {screen === 'menu' ? (
        <MenuScreen
          progress={progress}
          next={constellation}
          onPlay={() => setScreen('game')}
          onStarLog={() => setScreen('starlog')}
          onPractice={() => setScreen('practice')}
          onParent={() => setScreen('parent')}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          key={constellation.id}
          constellation={constellation}
          onGameOver={handleGameOver}
          onPause={() => setScreen('menu')}
        />
      ) : null}

      {screen === 'gameover' && result ? (
        <GameOverScreen
          result={result}
          mapped={progress.mapped}
          nextRuleLabel={ruleTitle(nextConstellation.rule)}
          onPlayAgain={handlePlayAgain}
          onMenu={() => setScreen('menu')}
        />
      ) : null}

      {screen === 'starlog' ? (
        <StarLogScreen mapped={progress.mapped} onBack={() => setScreen('menu')} />
      ) : null}

      {screen === 'practice' ? (
        <PracticeScreen
          table={constellation.table}
          onFinish={handleGameOver}
          onBack={() => setScreen('menu')}
        />
      ) : null}

      {screen === 'parent' ? (
        <ParentCornerScreen
          mastery={progress.mastery}
          onBack={() => setScreen('menu')}
          onReset={() => {
            reset();
            setScreen('menu');
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bgDeep,
  },
});
