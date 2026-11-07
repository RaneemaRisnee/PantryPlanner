import { StyleSheet, View } from 'react-native';

import { colors, radius } from '../theme';

export default function ProgressBar({ fraction }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${fraction * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    height: 6,
    overflow: 'hidden',
  },
  fill: { backgroundColor: colors.accent, height: '100%' },
});
