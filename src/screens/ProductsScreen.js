import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useProducts } from '../context/ProductContext';
import { formatCurrency } from '../utils/helpers';
import SearchBar from '../components/SearchBar';
import FilterModal from '../components/FilterModal';
import EmptyState from '../components/EmptyState';
import LowStockBadge from '../components/LowStockBadge';

export default function ProductsScreen({ navigation }) {
  const { products, deleteProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filtered = useMemo(() => {
    let list = products;
    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, search, selectedCategory]);

  const handleDelete = useCallback(
    (id, name) => {
      Alert.alert('Delete Product', `Delete "${name}"?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProduct(id),
        },
      ]);
    },
    [deleteProduct]
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.cardLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name="cube-outline" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productSku}>{item.sku}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
            <Text style={styles.productStock}>Stock: {item.stock}</Text>
          </View>
          <LowStockBadge stock={item.stock} minStock={item.minStock} />
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item.id, item.name)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.accent} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name or SKU..."
        />
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons
            name="options-outline"
            size={22}
            color={selectedCategory ? COLORS.primary : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {selectedCategory && (
        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{selectedCategory}</Text>
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Ionicons name="close-circle" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No products found"
            message="Try adjusting your search or add a new product."
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ProductForm', {})}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onClear={() => {
          setSelectedCategory(null);
          setFilterVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
    paddingTop: SIZES.lg,
    gap: SIZES.sm,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: SIZES.radius.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipRow: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.xl,
    paddingBottom: SIZES.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs + 2,
    borderRadius: SIZES.radius.xl,
    gap: SIZES.xs,
  },
  chipText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  list: {
    padding: SIZES.xl,
    paddingBottom: 100,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.md,
    padding: SIZES.lg,
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
    backgroundColor: COLORS.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  cardInfo: {
    flex: 1,
  },
  productName: {
    ...FONTS.medium,
    fontSize: 15,
    color: COLORS.text,
  },
  productSku: {
    ...FONTS.caption,
    color: COLORS.textLight,
    marginTop: 2,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.xs,
    gap: SIZES.md,
  },
  productPrice: {
    ...FONTS.semibold,
    color: COLORS.primary,
  },
  productStock: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  deleteBtn: {
    padding: SIZES.sm,
  },
  fab: {
    position: 'absolute',
    right: SIZES.xl,
    bottom: SIZES.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
});
