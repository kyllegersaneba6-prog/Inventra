import React from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useProducts } from '../context/ProductContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';
import LowStockBadge from '../components/LowStockBadge';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const { getProduct, deleteProduct } = useProducts();
  const product = getProduct(productId);

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete Product', `Delete "${product.name}" permanently?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteProduct(product.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.iconLarge}>
          <Ionicons name="cube" size={40} color={COLORS.primary} />
        </View>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.sku}>SKU: {product.sku}</Text>
        <LowStockBadge stock={product.stock} minStock={product.minStock} />
      </View>

      <AppCard>
        <Text style={styles.sectionTitle}>Pricing & Inventory</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Price</Text>
          <Text style={styles.detailValue}>{formatCurrency(product.price)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Current Stock</Text>
          <Text style={[styles.detailValue, product.stock <= product.minStock && styles.lowStock]}>
            {product.stock} units
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Min Stock Level</Text>
          <Text style={styles.detailValue}>{product.minStock} units</Text>
        </View>
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category</Text>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{product.category}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created</Text>
          <Text style={styles.detailValue}>{formatDate(product.createdAt)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Updated</Text>
          <Text style={styles.detailValue}>{formatDate(product.updatedAt)}</Text>
        </View>
        {product.description ? (
          <View style={styles.descContainer}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        ) : null}
      </AppCard>

      <View style={styles.actions}>
        <AppButton
          title="Edit Product"
          onPress={() => navigation.navigate('ProductForm', { productId: product.id })}
          style={styles.actionBtn}
        />
        <AppButton
          title="Delete"
          variant="danger"
          onPress={handleDelete}
          style={styles.actionBtn}
        />
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...FONTS.h4,
    color: COLORS.error,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  iconLarge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.md,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.text,
    textAlign: 'center',
  },
  sku: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
    marginBottom: SIZES.sm,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
  },
  detailValue: {
    ...FONTS.medium,
    color: COLORS.text,
  },
  lowStock: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  categoryTag: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radius.xl,
  },
  categoryTagText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  descContainer: {
    marginTop: SIZES.md,
  },
  description: {
    ...FONTS.regular,
    color: COLORS.text,
    marginTop: SIZES.sm,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: SIZES.md,
    marginTop: SIZES.lg,
  },
  actionBtn: {
    flex: 1,
  },
});
