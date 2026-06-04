import React, { useState, useMemo } from 'react';
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
import { useSales } from '../context/SaleContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';
import SearchBar from '../components/SearchBar';
import AppButton from '../components/AppButton';

export default function SaleFormScreen({ navigation }) {
  const { products, updateProduct } = useProducts();
  const { addSale } = useSales();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }, [products, search]);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      Alert.alert('Out of Stock', `${product.name} is currently out of stock.`);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          unitPrice: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          const product = products.find((p) => p.id === productId);
          return { ...item, quantity: Math.min(newQty, product ? product.stock : 999) };
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = +(subtotal * 0.12).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Add at least one item to complete a sale.');
      return;
    }

    Alert.alert(
      'Complete Sale',
      `Total: ${formatCurrency(total)}\nItems: ${cart.reduce((s, i) => s + i.quantity, 0)}\n\nConfirm this sale?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            addSale({
              items: cart.map(({ productId, productName, unitPrice, quantity }) => ({
                productId,
                productName,
                unitPrice,
                quantity,
              })),
              createdBy: user?.name || 'Unknown',
            });

            cart.forEach((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (product) {
                updateProduct(product.id, {
                  stock: product.stock - item.quantity,
                });
              }
            });

            Alert.alert('Sale Complete', 'Transaction recorded successfully.', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          },
        },
      ]
    );
  };

  const renderProductItem = ({ item }) => {
    const inCart = cart.find((c) => c.productId === item.id);
    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => addToCart(item)}
        activeOpacity={0.7}
      >
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productSku}>{item.sku}</Text>
          <View style={styles.productMeta}>
            <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
            <Text style={[styles.productStock, item.stock <= item.minStock && styles.lowStock]}>
              Stock: {item.stock}
            </Text>
          </View>
        </View>
        {inCart ? (
          <View style={styles.qtyBadge}>
            <Text style={styles.qtyBadgeText}>{inCart.quantity}</Text>
          </View>
        ) : (
          <Ionicons name="add-circle-outline" size={28} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search products to add..."
        />
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          style={styles.productList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products found</Text>
          }
        />
      </View>

      <View style={styles.cartSection}>
        <View style={styles.cartHeader}>
          <Text style={styles.cartTitle}>Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)</Text>
        </View>

        {cart.length === 0 ? (
          <Text style={styles.cartEmpty}>Tap a product above to add it to the cart.</Text>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.productId}
            style={styles.cartList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName} numberOfLines={1}>{item.productName}</Text>
                  <Text style={styles.cartItemPrice}>
                    {formatCurrency(item.unitPrice)} x {item.quantity}
                  </Text>
                </View>
                <View style={styles.cartItemActions}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.productId, -1)}
                  >
                    <Ionicons name="remove" size={18} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.productId, 1)}
                  >
                    <Ionicons name="add" size={18} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeFromCart(item.productId)}
                  >
                    <Ionicons name="trash-outline" size={18} color={COLORS.accent} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax (12%)</Text>
          <Text style={styles.totalValue}>{formatCurrency(tax)}</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotalRow]}>
          <Text style={styles.grandTotalLabel}>Total</Text>
          <Text style={styles.grandTotalValue}>{formatCurrency(total)}</Text>
        </View>

        <AppButton
          title="Complete Sale"
          onPress={handleCompleteSale}
          disabled={cart.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topSection: {
    flex: 1,
    padding: SIZES.xl,
    paddingBottom: 0,
  },
  productList: {
    flex: 1,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.sm,
    padding: SIZES.md,
    marginBottom: SIZES.xs,
    ...SHADOWS.sm,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    ...FONTS.medium,
    fontSize: 14,
    color: COLORS.text,
  },
  productSku: {
    ...FONTS.caption,
    color: COLORS.textLight,
    marginTop: 1,
  },
  productMeta: {
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
  lowStock: {
    color: COLORS.accent,
  },
  qtyBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBadgeText: {
    ...FONTS.caption,
    color: COLORS.white,
    fontWeight: '700',
  },
  emptyText: {
    ...FONTS.regular,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingVertical: SIZES.xl,
  },
  cartSection: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: SIZES.radius.lg,
    borderTopRightRadius: SIZES.radius.lg,
    padding: SIZES.xl,
    maxHeight: '45%',
    ...SHADOWS.lg,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  cartTitle: {
    ...FONTS.h4,
    color: COLORS.text,
  },
  cartEmpty: {
    ...FONTS.regular,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingVertical: SIZES.lg,
  },
  cartList: {
    maxHeight: 160,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    ...FONTS.medium,
    color: COLORS.text,
  },
  cartItemPrice: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    ...FONTS.semibold,
    color: COLORS.text,
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    padding: SIZES.xs,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.xs,
  },
  totalLabel: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
  },
  totalValue: {
    ...FONTS.regular,
    color: COLORS.text,
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.sm,
    marginBottom: SIZES.md,
  },
  grandTotalLabel: {
    ...FONTS.semibold,
    fontSize: 16,
    color: COLORS.text,
  },
  grandTotalValue: {
    ...FONTS.bold,
    fontSize: 18,
    color: COLORS.primary,
  },
});
