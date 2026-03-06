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
  type: "Batch";
  payload: Tick[];
}

export interface RiskMessage {
  type: "Risk";
  payload: RiskAlert;
}

export type WsMessage = BatchMessage | RiskMessage;

export const WorkerMessageType = {
  BATCH_UPDATE: "BATCH_UPDATE",
  RISK_UPDATE: "RISK_UPDATE",
} as const;

export type WorkerMessage =
  | { type: typeof WorkerMessageType.BATCH_UPDATE; payload: Tick[] }
  | { type: typeof WorkerMessageType.RISK_UPDATE; payload: RiskAlert };
