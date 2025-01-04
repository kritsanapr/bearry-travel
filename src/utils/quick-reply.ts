import { AGENDA } from '../constants';

const getDates = () => {
  const tripAgenda = AGENDA['Tokyo Trip 2025'];
  return tripAgenda.map(day => day.date);
};

export const createQuickReplyDateMessage = (): any => {
  const dates = getDates();
  return {
    type: 'text',
    text: 'Select a date:',
    quickReply: {
      items: dates.map(date => {
        return {
          type: 'action',
          action: {
            type: 'message',
            label: date,
            text: 'แพลนวันที่' + date,
          },
        };
      }),
    },
  };
};

export const createQuickReplyMessage = (): any => {
  return {
    type: 'text',
    text: 'What would you like to do next?',
    quickReply: {
      items: [
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'View Agenda',
            text: 'View Agenda',
          },
        },
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'Add New Event',
            text: 'Add New Event',
          },
        },
        {
          type: 'action',
          action: {
            type: 'uri',
            label: 'Visit Website',
            uri: 'https://example.com',
          },
        },
      ],
    },
  };
};
