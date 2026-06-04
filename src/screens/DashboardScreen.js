import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useProducts } from '../context/ProductContext';
import { useSales } from '../context/SaleContext';
import { formatCurrency } from '../utils/helpers';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';
import LowStockBadge from '../components/LowStockBadge';

export default function DashboardScreen({ navigation }) {
  const { products, getLowStockProducts } = useProducts();
  const { sales } = useSales();
  const lowStockItems = getLowStockProducts();

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalProducts = products.length;
  const totalSales = sales.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Dashboard</Text>
      <Text style={styles.subtitle}>Overview of your inventory</Text>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: COLORS.primary + '12' }]}>
          <Ionicons name="cube" size={28} color={COLORS.primary} />
          <Text style={styles.statValue}>{totalProducts}</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.secondary + '12' }]}>
          <Ionicons name="receipt" size={28} color={COLORS.secondary} />
          <Text style={styles.statValue}>{totalSales}</Text>
          <Text style={styles.statLabel}>Sales</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.warning + '20' }]}>
          <Ionicons name="alert-circle" size={28} color={COLORS.warning} />
          <Text style={styles.statValue}>{lowStockItems.length}</Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
      </View>

      <AppCard>
        <Text style={styles.sectionTitle}>Total Revenue</Text>
        <Text style={styles.revenue}>{formatCurrency(totalRevenue)}</Text>
      </AppCard>

      {lowStockItems.length > 0 && (
        <AppCard style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Ionicons name="warning" size={22} color={COLORS.warning} />
            <Text style={styles.alertTitle}>Low Stock Alert</Text>
          </View>
          {lowStockItems.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.alertItem}>
              <Text style={styles.alertItemName}>{item.name}</Text>
              <LowStockBadge stock={item.stock} minStock={item.minStock} />
            </View>
          ))}
          {lowStockItems.length > 3 && (
            <Text style={styles.alertMore}>+{lowStockItems.length - 3} more items</Text>
          )}
        </AppCard>
      )}

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <AppButton
            title="Add Product"
            onPress={() => navigation.navigate('ProductsTab', { screen: 'ProductForm' })}
            style={styles.actionBtn}
          />
          <AppButton
            title="New Sale"
            variant="outline"
            onPress={() => navigation.navigate('POSTab', { screen: 'SaleForm' })}
            style={styles.actionBtn}
          />
        </View>
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Sales</Text>
        {sales.slice(0, 3).map((sale) => (
          <View key={sale.id} style={styles.recentItem}>
            <View>
              <Text style={styles.recentItemName}>
                {sale.itemCount} item{sale.itemCount > 1 ? 's' : ''}
              </Text>
              <Text style={styles.recentItemDate}>
                {new Date(sale.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.recentItemTotal}>{formatCurrency(sale.total)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.xl,
    paddingBottom: 40,
  },
  greeting: {
    ...FONTS.h1,
    color: COLORS.text,
  },
  subtitle: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
    marginBottom: SIZES.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SIZES.md,
    marginBottom: SIZES.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: SIZES.radius.md,
    padding: SIZES.lg,
    alignItems: 'center',
  },
  statValue: {
    ...FONTS.h2,
    color: COLORS.text,
    marginTop: SIZES.sm,
  },
  statLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  revenue: {
    ...FONTS.h2,
    color: COLORS.primary,
  },
  alertCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  alertTitle: {
    ...FONTS.h4,
    color: COLORS.warning,
    marginLeft: SIZES.sm,
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  alertItemName: {
    ...FONTS.regular,
    color: COLORS.text,
    flex: 1,
    marginRight: SIZES.sm,
  },
  alertMore: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: SIZES.sm,
    textAlign: 'center',
  },
  quickActions: {
    marginTop: SIZES.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  actionBtn: {
    flex: 1,
  },
  recentSection: {
    marginTop: SIZES.xl,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.sm,
    marginBottom: SIZES.sm,
    ...SHADOWS.sm,
  },
  recentItemName: {
    ...FONTS.medium,
    color: COLORS.text,
  },
  recentItemDate: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  recentItemTotal: {
    ...FONTS.semibold,
    color: COLORS.primary,
  },
});
