export interface ApiResponse<T> {
  data: T;
  meta: {
    calculationSystem: string;
    apiVersion: string;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
