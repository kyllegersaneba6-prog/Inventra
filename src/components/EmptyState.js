import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';

export default function EmptyState({ icon = 'cube-outline', title, message }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={COLORS.textLight} />
      <Text style={styles.title}>{title || 'No items found'}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: SIZES.xl,
  },
  title: {
    ...FONTS.h4,
    color: COLORS.textSecondary,
    marginTop: SIZES.lg,
    textAlign: 'center',
  },
  message: {
    ...FONTS.regular,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SIZES.sm,
  },
});
