import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { CATEGORIES } from '../utils/helpers';
import AppButton from './AppButton';

export default function FilterModal({
  visible,
  onClose,
  selectedCategory,
  onSelectCategory,
  onClear,
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title}>Filter by Category</Text>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.option,
                !selectedCategory && styles.optionSelected,
              ]}
              onPress={() => onSelectCategory(null)}
            >
              <Text
                style={[
                  styles.optionText,
                  !selectedCategory && styles.optionTextSelected,
                ]}
              >
                All Categories
              </Text>
            </TouchableOpacity>

            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.option,
                  selectedCategory === cat && styles.optionSelected,
                ]}
                onPress={() => onSelectCategory(cat)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedCategory === cat && styles.optionTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.actions}>
            <AppButton
              title="Clear Filter"
              variant="outline"
              onPress={onClear}
              style={styles.btn}
            />
            <AppButton title="Apply" onPress={onClose} style={styles.btn} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: SIZES.radius.xl,
    borderTopRightRadius: SIZES.radius.xl,
    paddingHorizontal: SIZES.xl,
    paddingBottom: 34,
    maxHeight: '75%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: SIZES.md,
    marginBottom: SIZES.lg,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.lg,
  },
  list: {
    maxHeight: 300,
  },
  option: {
    paddingVertical: SIZES.md + 2,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radius.sm,
    marginBottom: SIZES.xs,
  },
  optionSelected: {
    backgroundColor: COLORS.primary + '15',
  },
  optionText: {
    ...FONTS.regular,
    fontSize: 15,
    color: COLORS.text,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    marginTop: SIZES.lg,
    gap: SIZES.md,
  },
  btn: {
    flex: 1,
  },
});
