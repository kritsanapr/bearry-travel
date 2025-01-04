import { AgendaEvent, AgendaDay, AgendaTrip } from '../types/agenda.interface';

import { FlexBubble, FlexBox, FlexMessage } from '@line/bot-sdk/dist/types';

const formatFullDate = (dateStr: string): string => {
  const [day, month, year] = dateStr.split('/');
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const monthIndex = parseInt(month) - 1;
  return `${parseInt(day)} ${thaiMonths[monthIndex]} ${year}`;
};

const createEventComponent = (event: AgendaEvent): FlexBox => {
  const recommendationBox: FlexBox | undefined = event.recommendations?.length
    ? {
        type: 'box',
        layout: 'vertical',
        contents: event.recommendations.map(rec => ({
          type: 'text',
          text: `🎯 ${rec}`,
          size: 'xs',
          color: '#aaaaaa',
          wrap: true,
        })),
        spacing: 'xs',
        margin: 'sm',
      }
    : undefined;

  const destinationBox: FlexBox | undefined = event.destinations?.length
    ? {
        type: 'box',
        layout: 'vertical',
        contents: event.destinations.map(dest => ({
          type: 'text',
          text: `📍 ${dest}`,
          size: 'xs',
          color: '#aaaaaa',
          wrap: true,
        })),
        spacing: 'xs',
        margin: 'sm',
      }
    : undefined;

  return {
    type: 'box',
    layout: 'horizontal',
    contents: [
      {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: event.time || '-',
            size: 'xs',
            color: '#aaaaaa',
            gravity: 'center',
          },
          {
            type: 'box',
            layout: 'vertical',
            alignItems: 'center',
            contents: [
              { type: 'filler' },
              {
                type: 'box',
                layout: 'vertical',
                contents: [],
                cornerRadius: '50px',
                width: '12px',
                height: '12px',
                borderColor: '#1DB446',
                borderWidth: '2px',
                backgroundColor: '#ffffff',
              },
              { type: 'filler' },
            ],
            width: '20px',
          },
          {
            type: 'box',
            layout: 'vertical',
            contents: [],
            width: '2px',
            backgroundColor: '#aaaaaa',
            flex: 1,
          },
        ],
        flex: 1,
        alignItems: 'center',
      },
      {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: event.description || 'No description available.',
            size: 'sm',
            color: '#666666',
            wrap: true,
          },
          ...(recommendationBox ? [recommendationBox] : []),
          ...(destinationBox ? [destinationBox] : []),
        ],
        flex: 4,
      },
    ],
    spacing: 'lg',
    paddingAll: 'md',
  };
};

const createDayBubble = (day: AgendaDay): FlexBubble => {
  return {
    type: 'bubble',
    size: 'mega',
    header: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: `📅 วันที่ ${formatFullDate(day.date)}`,
          weight: 'bold',
          size: 'lg',
          color: '#ffffff',
        },
      ],
      backgroundColor: '#27ACB2',
      paddingAll: 'md',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: day.events.map((event, index) => {
        const eventComponent = createEventComponent(event);

        // Add a spacer for separation, except for the last event
        if (index < day.events.length - 1) {
          eventComponent.contents.push({
            type: 'box',
            layout: 'vertical',
            contents: [],
            height: '10px',
          });
        }

        return eventComponent;
      }),
      spacing: 'md',
    },
  };
};

export const createAgendaFlexMessage = (agenda: AgendaTrip): FlexMessage => {
  const bubbles = agenda.map(day => createDayBubble(day));

  return {
    type: 'flex',
    altText:
      agenda.length === 1
        ? `แผนการเดินทางวันที่ ${formatFullDate(agenda[0].date)}`
        : 'แผนการเดินทางทั้งหมด',
    contents:
      agenda.length === 1
        ? bubbles[0] // Single bubble for one day
        : {
            type: 'carousel',
            contents: bubbles,
          },
  };
};
