export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  userFullName: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}