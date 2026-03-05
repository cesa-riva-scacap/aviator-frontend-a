/**
 * This file is going to act as our "shield." It will connect to the Rust server,
 * catch the 40,000 ticks per second, maintain the latest state of the market in a dictionary (our batching),
 * and only send a clean, lightweight summary to React when React asks for it.
 * Instead of sending 40,000 messages to React, we send 60 messages per second (one per frame)
 */

import type { Tick, WsMessage } from "./types";

const priceMap: Map<string, Tick> = new Map();

const socket = new WebSocket("ws://127.0.0.1:8080/ws");

socket.onmessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data) as WsMessage;

  if (data.type === "Batch") {
    // 1. BATCHING: Update the map with the latest values.
    // If AAPL ticked 50 times in this batch, we only keep the 50th one.
    data.payload.forEach((tick) => {
      priceMap.set(tick.symbol, tick);
    });
  } else if (data.type === "Risk") {
    // 2. PRIORITY: Risk alerts bypass the timer and go to React IMMEDIATELY
    self.postMessage({
      type: "RISK_UPDATE",
      payload: data.payload,
    });
  }
};

// 3. THROTTLING: Every 16ms (~60 FPS), we send the current state of the market to React.
// This ensures the main thread is never overwhelmed by the 40k/sec firehose.
setInterval(
  () => {
    const latestTicks = Array.from(priceMap.values());
    if (priceMap.size > 0) {
      self.postMessage({
        type: "BATCH_UPDATE",
        payload: latestTicks,
      });
    }
  },
  1000 / 60, // 60 times per second
);
