export interface JwtPayload {
  userId: number;
  companyId: number;
  email: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}
