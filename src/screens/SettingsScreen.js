import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useSales } from '../context/SaleContext';
import AppCard from '../components/AppCard';
import AppButton from '../components/AppButton';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { products } = useProducts();
  const { sales } = useSales();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppCard style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={36} color={COLORS.primary} />
        </View>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role || 'Staff'}</Text>
        </View>
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>System Summary</Text>
        <View style={styles.statRow}>
          <Ionicons name="cube-outline" size={20} color={COLORS.primary} />
          <Text style={styles.statLabel}>Total Products</Text>
          <Text style={styles.statValue}>{products.length}</Text>
        </View>
        <View style={styles.statRow}>
          <Ionicons name="receipt-outline" size={20} color={COLORS.secondary} />
          <Text style={styles.statLabel}>Total Sales</Text>
          <Text style={styles.statValue}>{sales.length}</Text>
        </View>
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>App Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>App Name</Text>
          <Text style={styles.infoValue}>Inventra</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Platform</Text>
          <Text style={styles.infoValue}>React Native (Expo)</Text>
        </View>
      </AppCard>

      <View style={styles.logoutSection}>
        <AppButton
          title="Logout"
          variant="danger"
          onPress={handleLogout}
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
  profileCard: {
    alignItems: 'center',
    paddingVertical: SIZES.xxl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.md,
  },
  userName: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  userEmail: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  roleBadge: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.xs + 2,
    borderRadius: SIZES.radius.xl,
    marginTop: SIZES.md,
  },
  roleText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statLabel: {
    ...FONTS.regular,
    color: COLORS.text,
    flex: 1,
    marginLeft: SIZES.md,
  },
  statValue: {
    ...FONTS.semibold,
    color: COLORS.text,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
  },
  infoValue: {
    ...FONTS.medium,
    color: COLORS.text,
  },
  logoutSection: {
    marginTop: SIZES.lg,
  },
});
