/**
 * This file is going to act as our "shield." It will connect to the Rust server,
 * catch the 40,000 ticks per second, maintain the latest state of the market in a dictionary (our batching),
 * and only send a clean, lightweight summary to React when React asks for it.
 * Instead of sending 40,000 messages to React, we send 60 messages per second (one per frame)
 */

import type { ClientCommand, Tick, WorkerMessage, WsMessage } from "./types";

const priceMap: Map<string, Tick> = new Map();

let isPaused = false;
let ticksReceivedThisSecond = 0;

self.onmessage = (event: MessageEvent<ClientCommand>) => {
  if (event.data.type === "TOGGLE_PAUSE") {
    isPaused = !isPaused;
    console.log(`Worker received command: ${isPaused ? "PAUSE" : "RESUME"}`);
  }
};

const socket = new WebSocket("ws://127.0.0.1:8080/ws");

socket.onmessage = (event: MessageEvent<string>) => {
  if (isPaused) return;

  let data: WsMessage;
  try {
    data = JSON.parse(event.data) as WsMessage;
  } catch (error) {
    console.error("Worker failed to parse WebSocket payload:", error);
    return;
  }

  const { type, payload } = data;

  if (type === "Batch") {
    // 1. BATCHING: Update the map with the latest values.

    ticksReceivedThisSecond += payload.length;

    payload.forEach((tick) => {
      priceMap.set(tick.symbol, tick);
    });
  } else if (type === "Risk") {
    // 2. PRIORITY: Risk alerts bypass the timer and go to React IMMEDIATELY
    const riskMessage: WorkerMessage = {
      type: "RISK_UPDATE",
      payload: payload,
    };

    self.postMessage(riskMessage);
  }
};

// 3. THROTTLING: Every 16ms (~60 FPS), we send the current state of the market to React.
// This ensures the main thread is never overwhelmed by the 40k/sec firehose.
setInterval(
  () => {
    if (isPaused) return;
    if (priceMap.size > 0) {
      const latestTicks = Array.from(priceMap.values());
      const message: WorkerMessage = {
        type: "BATCH_UPDATE",
        payload: latestTicks,
      };
      self.postMessage(message);
    }
  },
  1000 / 60, // 60 times per second
);

// 2. METRICS REPORTING (1 per second)
setInterval(() => {
  const metricsMessage: WorkerMessage = {
    type: "METRICS_UPDATE",
    payload: {
      throughput: ticksReceivedThisSecond,
      isPaused: isPaused,
    },
  };
  self.postMessage(metricsMessage);

  // Reset the counter for the next second
  ticksReceivedThisSecond = 0;
}, 1000);
