export interface AgendaEvent {
  time: string;
  description: string;
  recommendations?: string[];
  destinations?: string[];
}

export interface AgendaDay {
  date: string;
  events: AgendaEvent[];
}

export type AgendaTrip = AgendaDay[];

export interface AgendaData {
  [tripName: string]: AgendaTrip;
}
