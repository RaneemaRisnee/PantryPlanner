import { StyleSheet, View } from 'react-native';

import { colors, radius } from '../theme';

export default function ProgressBar({ fraction }) {
  return (
    <View
      accessibilityRole="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(fraction * 100)}
      style={styles.track}
    >
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
