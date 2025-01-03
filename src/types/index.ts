export * from './line-event.interface';
export { AgendaEvent } from './agenda.interface';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  code?: number;
}
