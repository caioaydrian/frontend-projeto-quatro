export interface Review {
  id: number;
  drinkId: number;
  userId: number;
  rating: number;
  comment?: string | null;
  user?: { id: number; name: string };
  drink?: { id: number; name: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewInput {
  drinkId: number;
  rating: number;
  comment?: string | null;
}
