import { apiFetch, type PaginatedResponse } from "../utils/api";
import type { Review, ReviewInput } from "../types/rating";

interface ReviewMessageResponse {
  message: string;
  review: Review;
}

export async function listReviews(page = 1, limit = 20, drinkId?: number): Promise<PaginatedResponse<Review>> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (drinkId !== undefined) params.set("drinkId", String(drinkId));
  return apiFetch<PaginatedResponse<Review>>(`/reviews?${params.toString()}`);
}

export async function createReview(data: ReviewInput): Promise<Review> {
  const res = await apiFetch<ReviewMessageResponse>("/reviews", {
    method: "POST",
    body: data,
  });
  return res.review;
}

export async function updateReview(id: number, rating: number): Promise<Review> {
  const res = await apiFetch<ReviewMessageResponse>(`/reviews/${id}`, {
    method: "PUT",
    body: { rating },
  });
  return res.review;
}

export async function deleteReview(id: number): Promise<void> {
  await apiFetch<{ message: string }>(`/reviews/${id}`, {
    method: "DELETE",
  });
}
