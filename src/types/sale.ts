export interface SaleItemDrink {
  id: number;
  name: string;
  price: number;
}

export interface SaleItem {
  id: number;
  saleId: number;
  drinkId: number;
  quantity: number;
  unitPrice: number;
  drink?: SaleItemDrink;
}

export interface SaleUser {
  id: number;
  name: string;
  email: string;
}

export interface Sale {
  id: number;
  userId: number;
  totalPrice: number | string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  user?: SaleUser;
  items?: SaleItem[];
}

