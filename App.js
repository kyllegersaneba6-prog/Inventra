import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ProductProvider } from './src/context/ProductContext';
import { SaleProvider } from './src/context/SaleContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ProductProvider>
          <SaleProvider>
            <StatusBar style="dark" />
            <AppNavigator />
          </SaleProvider>
        </ProductProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
