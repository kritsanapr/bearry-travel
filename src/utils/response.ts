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
  time: string;
  description: string;
  recommendations?: string[];
  destinations?: string[];
}

interface AgendaDay {
  date: string;
  events: AgendaEvent[];
}

type AgendaTrip = AgendaDay[];

interface Agenda {
  [tripName: string]: AgendaTrip;
}

export function formatAgenda(agenda: AgendaTrip): string {
  return agenda
    .map(day => {
      const dayInfo = `📅 ${day.date}\n`;
      const events = day.events
        .map(event => {
          let eventText = `⏰ ${event.time} - ${event.description}`;
          
          if (event.recommendations?.length) {
            eventText += '\n🔍 Recommendations:\n' + event.recommendations.map(r => `  • ${r}`).join('\n');
          }
          
          if (event.destinations?.length) {
            eventText += '\n📍 Destinations:\n' + event.destinations.map(d => `  • ${d}`).join('\n');
          }
          
          return eventText;
        })
        .join('\n\n');

      return `${dayInfo}\n${events}`;
    })
    .join('\n\n---\n\n');
}
