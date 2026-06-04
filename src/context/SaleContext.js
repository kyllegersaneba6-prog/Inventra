import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_SALES } from '../data/mockData';
import { generateId } from '../utils/helpers';

const SaleContext = createContext(null);

export function SaleProvider({ children }) {
  const [sales, setSales] = useState(MOCK_SALES);

  const addSale = useCallback((saleData) => {
    const now = new Date().toISOString();
    const itemCount = saleData.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = saleData.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const tax = +(subtotal * 0.12).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    const newSale = {
      id: generateId(),
      items: saleData.items,
      subtotal,
      tax,
      total,
      itemCount,
      createdAt: now,
      createdBy: saleData.createdBy || 'Unknown',
    };

    setSales((prev) => [newSale, ...prev]);
    return newSale;
  }, []);

  const getSale = useCallback(
    (id) => {
      return sales.find((s) => s.id === id) || null;
    },
    [sales]
  );

  const getRecentSales = useCallback(
    (limit = 5) => {
      return sales.slice(0, limit);
    },
    [sales]
  );

  return (
    <SaleContext.Provider value={{ sales, addSale, getSale, getRecentSales }}>
      {children}
    </SaleContext.Provider>
  );
}

export function useSales() {
  const ctx = useContext(SaleContext);
  if (!ctx) throw new Error('useSales must be used within SaleProvider');
  return ctx;
}
