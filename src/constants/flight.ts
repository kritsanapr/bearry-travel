export const FLIGHTS_NUMBER = {
  departure: {
    flightNumber: 'TG682',
    departure: 'BKK',
    arrival: 'NRT',
    departureTime: '00:15',
    arrivalTime: '08.10',
    terminal: '1',
  },
  arrival: {
    flightNumber: 'TG683',
    departure: 'NRT',
    arrival: 'BKK',
    departureTime: '17.35',
    arrivalTime: '23.00',
    terminal: '2',
  },
} as const;

export type FlightType = 'departure' | 'arrival';
