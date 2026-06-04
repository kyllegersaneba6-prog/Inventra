import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useSales } from '../context/SaleContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import EmptyState from '../components/EmptyState';

export default function SalesScreen({ navigation }) {
  const { sales } = useSales();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.saleCard} activeOpacity={0.7}>
      <View style={styles.cardLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name="receipt" size={24} color={COLORS.secondary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.saleId}>{item.id}</Text>
          <Text style={styles.saleDate}>{formatDate(item.createdAt)}</Text>
          <Text style={styles.saleCashier}>by {item.createdBy}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.saleTotal}>{formatCurrency(item.total)}</Text>
        <Text style={styles.saleItems}>
          {item.itemCount} item{item.itemCount > 1 ? 's' : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sales}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Sales History</Text>
            <Text style={styles.count}>{sales.length} total sale{sales.length !== 1 ? 's' : ''}</Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="No sales yet"
            message="Start by creating a new sale."
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('SaleForm')}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.xl,
    paddingTop: SIZES.lg,
    paddingBottom: SIZES.md,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  count: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  list: {
    paddingBottom: 100,
  },
  saleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.md,
    padding: SIZES.lg,
    marginHorizontal: SIZES.xl,
    marginBottom: SIZES.sm,
    ...SHADOWS.sm,
  },
  cardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: SIZES.radius.sm,
    backgroundColor: COLORS.secondary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  cardInfo: {
    flex: 1,
  },
  saleId: {
    ...FONTS.medium,
    fontSize: 15,
    color: COLORS.text,
  },
  saleDate: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  saleCashier: {
    ...FONTS.caption,
    color: COLORS.textLight,
    marginTop: 1,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  saleTotal: {
    ...FONTS.semibold,
    color: COLORS.secondary,
  },
  saleItems: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    right: SIZES.xl,
    bottom: SIZES.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
});
