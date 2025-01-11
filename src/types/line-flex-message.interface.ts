export interface FlexMessage {
  type: 'flex';
  altText: string;
  contents: FlexBubble;
}

export interface FlexBubble {
  type: 'bubble';
  body: FlexBox;
}

export interface FlexBox {
  type: 'box';
  layout: 'horizontal' | 'vertical' | 'baseline';
  contents: FlexComponent[];
  paddingAll?: string;
  margin?: string;
  spacing?: string;
}

export interface FlexText {
  type: 'text';
  text: string;
  weight?: 'regular' | 'bold';
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '3xl' | '4xl' | '5xl';
  align?: 'start' | 'end' | 'center';
  color?: string;
  margin?: string;
  flex?: number;
  wrap?: boolean;
}

export type FlexComponent = FlexBox | FlexText;
