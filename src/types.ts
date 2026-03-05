export interface Tick {
  symbol: string;
  price: number;
  volume: number;
}

export interface RiskAlert {
  level: string;
  message: string;
}

export interface BatchMessage {
  type: 'Batch';
  payload: Tick[];
}

export interface RiskMessage {
  type: 'Risk';
  payload: RiskAlert;
}

export type WsMessage = BatchMessage | RiskMessage;