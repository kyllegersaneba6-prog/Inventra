import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';

export default function LowStockBadge({ stock, minStock }) {
  const isLow = stock <= minStock;
  const isOut = stock === 0;

  if (!isLow) return null;

  return (
    <View style={[styles.badge, isOut && styles.badgeOut]}>
      <Text style={[styles.text, isOut && styles.textOut]}>
        {isOut ? 'Out of Stock' : `Low: ${stock}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: SIZES.sm + 2,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radius.sm,
    alignSelf: 'flex-start',
  },
  badgeOut: {
    backgroundColor: COLORS.error + '20',
  },
  text: {
    ...FONTS.caption,
    fontWeight: '600',
    color: COLORS.warning,
  },
  textOut: {
    color: COLORS.error,
  },
});
