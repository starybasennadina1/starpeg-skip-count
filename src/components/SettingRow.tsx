import React, { memo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  label: string;
  hint?: string;
  children: ReactNode;
};

function SettingRowBase({ label, hint, children }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <View style={styles.control}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(43,55,104,0.50)',
    borderWidth: 1,
    borderColor: 'rgba(142,168,255,0.18)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  text: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text,
  },
  hint: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.textMuted,
  },
  control: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export const SettingRow = memo(SettingRowBase);
export default SettingRow;
