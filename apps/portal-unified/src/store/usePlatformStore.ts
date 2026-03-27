import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'cliente' | 'proveedor' | null;
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTER_OFFER' | 'PAID';

export interface Order {
  id: string;
  serviceName: string;
  providerName: string;
  providerEmail: string;
  clientEmail: string;
  status: OrderStatus;
  date: string;
  time: string;
  price: number;
  counterOffer?: {
    date: string;
    time: string;
    message: string;
  };
}

interface PlatformState {
  currentUser: { email: string; role: UserRole } | null;
  orders: Order[];
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  createOrder: (order: Omit<Order, 'id'>) => void;
  updateOrderStatus: (id: string, status: OrderStatus, counterOffer?: Order['counterOffer']) => void;
}

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set) => ({
      currentUser: null,
      orders: [],
      login: (email, role) => set({ currentUser: { email, role } }),
      logout: () => set({ currentUser: null }),
      createOrder: (orderData) => set((state) => ({
        orders: [...state.orders, { ...orderData, id: Math.random().toString(36).substr(2, 9) }]
      })),
      updateOrderStatus: (id, status, counterOffer) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status, ...(counterOffer ? { counterOffer } : {}) } : o)
      })),
    }),
    {
      name: 'imendly-platform-storage',
    }
  )
);
