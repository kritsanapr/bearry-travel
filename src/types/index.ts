export * from './line-event.interface';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  code?: number;
}
