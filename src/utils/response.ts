export const createResponse = <T>(data: T, message: string = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
};

export const createErrorResponse = (message: string, code: number = 400) => {
  return {
    success: false,
    message,
    code,
  };
};

interface AgendaEvent {
  time?: string;
  description: string;
}

interface AgendaDay {
  title?: string;
  events: AgendaEvent[];
}

interface AgendaTrip {
  [date: string]: AgendaDay;
}

interface Agenda {
  [tripName: string]: AgendaTrip;
}

export function formatAgenda(agenda: AgendaTrip): string {
  return Object.entries(agenda).map(([date, day]) => {
    const dayInfo = `📅 ${date}\n${day.title ? `🗓 ${day.title}\n` : ''}`;
    const events = day.events.map(event => 
      `${event.time ? `⏰ ${event.time}\n` : ''}📝 ${event.description}`
    ).join('\n\n');
    return dayInfo + events;
  }).join('\n\n-------------------\n\n');
}
