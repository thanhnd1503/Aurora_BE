// DTO (Data Transfer Object) cho response
export interface HttpException {
  message: string;
  status?: number;
  // Add other properties you expect from your errors
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
}
