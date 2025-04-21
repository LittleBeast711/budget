import { create } from 'zustand';

type Bill = {
  id: string
  name: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

type Store = {
  bills: Bill[]
  addBill: (bill: Bill) => void
}

export const useBills = create<Store>((set) => ({
  bills: [],
  addBill: (bill) => set((state) => ({ bills: [...state.bills, bill] })),
}))