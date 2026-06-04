import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../utils/helpers';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';

export default function ProductFormScreen({ route, navigation }) {
  const { addProduct, updateProduct, getProduct } = useProducts();
  const productId = route.params?.productId;
  const isEdit = !!productId;

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      const product = getProduct(productId);
      if (product) {
        setName(product.name);
        setSku(product.sku);
        setCategory(product.category);
        setPrice(String(product.price));
        setStock(String(product.stock));
        setMinStock(String(product.minStock));
        setDescription(product.description || '');
      }
    }
  }, [productId, isEdit]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!sku.trim()) newErrors.sku = 'SKU is required';
    if (!category) newErrors.category = 'Select a category';
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0)
      newErrors.price = 'Enter a valid price';
    if (!stock.trim() || isNaN(Number(stock)) || Number(stock) < 0)
      newErrors.stock = 'Enter a valid stock quantity';
    if (!minStock.trim() || isNaN(Number(minStock)) || Number(minStock) < 0)
      newErrors.minStock = 'Enter a valid reorder level';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const data = {
      name: name.trim(),
      sku: sku.trim(),
      category,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      minStock: parseInt(minStock, 10),
      description: description.trim(),
    };

    if (isEdit) {
      updateProduct(productId, data);
      Alert.alert('Updated', 'Product updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      addProduct(data);
      Alert.alert('Added', 'Product added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const isFormValid = name.trim() && sku.trim() && category && price && stock && minStock;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{isEdit ? 'Edit Product' : 'Add Product'}</Text>

      <AppInput
        label="Product Name"
        value={name}
        onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: '' })); }}
        placeholder="Enter product name"
        error={errors.name}
      />

      <AppInput
        label="SKU"
        value={sku}
        onChangeText={(t) => { setSku(t); setErrors((e) => ({ ...e, sku: '' })); }}
        placeholder="e.g. ELEC-001"
        autoCapitalize="characters"
        error={errors.sku}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              category === cat && styles.categoryChipActive,
            ]}
            onPress={() => { setCategory(cat); setErrors((e) => ({ ...e, category: '' })); }}
          >
            <Text
              style={[
                styles.categoryText,
                category === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

      <View style={styles.row}>
        <AppInput
          label="Price ($)"
          value={price}
          onChangeText={(t) => { setPrice(t); setErrors((e) => ({ ...e, price: '' })); }}
          placeholder="0.00"
          keyboardType="decimal-pad"
          error={errors.price}
          style={styles.halfInput}
        />
        <AppInput
          label="Stock"
          value={stock}
          onChangeText={(t) => { setStock(t); setErrors((e) => ({ ...e, stock: '' })); }}
          placeholder="0"
          keyboardType="number-pad"
          error={errors.stock}
          style={styles.halfInput}
        />
      </View>

      <AppInput
        label="Min Stock Level"
        value={minStock}
        onChangeText={(t) => { setMinStock(t); setErrors((e) => ({ ...e, minStock: '' })); }}
        placeholder="0"
        keyboardType="number-pad"
        error={errors.minStock}
      />

      <AppInput
        label="Description (optional)"
        value={description}
        onChangeText={setDescription}
        placeholder="Enter product description"
        multiline
      />

      <View style={styles.actions}>
        <AppButton
          title="Cancel"
          variant="outline"
          onPress={() => navigation.goBack()}
          style={styles.actionBtn}
        />
        <AppButton
          title={isEdit ? 'Update' : 'Save'}
          onPress={handleSubmit}
          disabled={!isFormValid}
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
  title: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SIZES.xl,
  },
  label: {
    ...FONTS.medium,
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
    marginBottom: SIZES.lg,
  },
  categoryChip: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radius.xl,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  categoryText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: COLORS.primary,
  },
  errorText: {
    ...FONTS.caption,
    color: COLORS.error,
    marginTop: -SIZES.md,
    marginBottom: SIZES.md,
  },
  row: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  halfInput: {
    flex: 1,
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
