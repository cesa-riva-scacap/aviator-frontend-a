import { useEffect, useRef, useState } from "react";
import { WorkerMessageType, type RiskAlert, type Tick } from "../../types";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { MetricsCard, type Metrics } from "./metrics-card";
import { ShieldAlert } from "lucide-react";
import PricesCard from "./prices-card";

export const Dashboard = () => {
  const [prices, setPrices] = useState<Tick[]>([]);
  const [risk, setRisk] = useState<RiskAlert | null>(null);
  const [fps, setFps] = useState(0);
  const [workerMetrics, setWorkerMetrics] = useState<Metrics>({
    throughput: 0,
    isPaused: false,
  });

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const countFrames = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(countFrames);
    };

    animationFrameId = requestAnimationFrame(countFrames);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../../data-worker.ts", import.meta.url),
    );

    workerRef.current.onmessage = (event: MessageEvent) => {
      const message = event.data;

      if (message.type === WorkerMessageType.RISK_UPDATE) {
        setRisk(message.payload);

        setTimeout(() => {
          setRisk(null);
        }, 2500);
      } else if (message.type === WorkerMessageType.BATCH_UPDATE) {
        setPrices(message.payload);
      } else if (message.type === WorkerMessageType.METRICS_UPDATE) {
        setWorkerMetrics(message.payload);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return (
    <div className="min-h-screen space-y-6 bg-slate-950 p-8 font-sans text-white">
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Aviator Frontend PoC - Market Making Workstation
        </h1>
        <span className="rounded border border-slate-700 px-2 py-1 font-mono text-sm text-slate-500">
          Phase 1: Pure Web App PoC (Optimized with Virtualization)
        </span>
      </div>

      <div className="h-20">
        {risk && (
          <Alert
            variant="destructive"
            className="animate-in fade-in zoom-in duration-200"
          >
            <ShieldAlert />
            <AlertTitle>Critical Risk Alert</AlertTitle>
            <AlertDescription>{risk.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PricesCard prices={prices} />
        <MetricsCard
          fps={fps}
          workerMetrics={workerMetrics}
          onToggleWorker={() => {
            workerRef.current?.postMessage({ type: "TOGGLE_PAUSE" });
          }}
        />
      </div>
    </div>
  );
};
