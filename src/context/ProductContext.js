import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_PRODUCTS } from '../data/mockData';
import { generateId } from '../utils/helpers';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const addProduct = useCallback((productData) => {
    const now = new Date().toISOString();
    const newProduct = {
      ...productData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id, productData) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...productData, updatedAt: new Date().toISOString() }
          : p
      )
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getProduct = useCallback((id) => {
    return products.find((p) => p.id === id) || null;
  }, [products]);

  const getLowStockProducts = useCallback(() => {
    return products.filter((p) => p.stock <= p.minStock);
  }, [products]);

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        getLowStockProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}
