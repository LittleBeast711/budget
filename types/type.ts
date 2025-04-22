export type Bill = {
  id: string
  title: string;
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

export type Category = {
  id: string
  name: string
}

export type RootStackParamList = {
  Main: undefined;
  Home: { newBill: { id: string; title: string; amount: number } } | undefined;
  AddBill: undefined;
  Settings: undefined;
  Category: undefined;
  Stats: undefined;
};

export const BILL_KEY = 'bills'
export const CATEGORY_KEY = 'categories'
