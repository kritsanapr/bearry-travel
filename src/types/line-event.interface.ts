export interface LineWebhookBody {
  destination: string;
  events: LineEvent[];
}

export interface LineEvent {
  postback: any;
  type: string;
  message?: LineMessage;
  webhookEventId: string;
  deliveryContext: {
    isRedelivery: boolean;
  };
  timestamp: number;
  source: {
    type: string;
    userId: string;
  };
  replyToken: string;
  mode: string;
}

export interface LineMessage {
  type: string;
  id: string;
  quoteToken: string;
  text?: string;
  stickerId?: string;
  image?: string;
  video?: string;
  audio?: string;
  location?: {
    latitude: number;
    longitude: number;
    name: string;
    address: string;
  };
  packageId?: string;
  productIds?: string[];
}
