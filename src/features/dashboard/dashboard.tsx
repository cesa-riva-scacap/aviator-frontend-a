import { useEffect, useRef, useState } from "react";
import { WorkerMessageType, type RiskAlert, type Tick } from "../../types";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { MetricsCard, type Metrics } from "./metrics-card";
import { ShieldAlert, AlertOctagon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const isPausedRef = useRef(workerMetrics.isPaused);

  useEffect(() => {
    isPausedRef.current = workerMetrics.isPaused;
  }, [workerMetrics.isPaused]);

  // FPS Counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const countFrames = () => {
      if (!isPausedRef.current) {
        frameCount++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
          setFps(frameCount);
          frameCount = 0;
          lastTime = now;
        }
      }
      animationFrameId = requestAnimationFrame(countFrames);
    };

    animationFrameId = requestAnimationFrame(countFrames);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Worker Setup
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../../data-worker.ts", import.meta.url),
      { type: "module" },
    );

    workerRef.current.onmessage = (event: MessageEvent) => {
      const message = event.data;

      if (message.type === WorkerMessageType.RISK_UPDATE) {
        setRisk(message.payload);
        setTimeout(() => setRisk(null), 2500);
      } else if (message.type === WorkerMessageType.BATCH_UPDATE) {
        setPrices(message.payload);
      } else if (message.type === WorkerMessageType.METRICS_UPDATE) {
        setWorkerMetrics(message.payload);
      }
    };

    return () => workerRef.current?.terminate();
  }, []);

  const handleToggleWorker = () => {
    workerRef.current?.postMessage({ type: "TOGGLE_PAUSE" });
  };

  return (
    <div className="min-h-screen space-y-6 bg-[#0B0F19] p-8 font-sans text-slate-300">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-teal-500/50 bg-teal-500/20">
            <div className="h-4 w-4 animate-pulse rounded-full bg-teal-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Market Making Workstation
            </h1>
            <span className="font-mono text-xs text-teal-400">Connected</span>
          </div>
        </div>
        <div className="flex gap-2 rounded-md border border-slate-800 bg-slate-900 p-1">
          <button className="rounded bg-slate-800 px-4 py-1.5 text-xs font-medium text-white shadow-sm">
            Global View
          </button>
          <button className="rounded px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-300">
            Instrument View
          </button>
        </div>
      </div>

      <div className="h-20">
        {risk && (
          <Alert
            variant="destructive"
            className="animate-in fade-in zoom-in border-red-900 bg-red-950/40 text-red-200 duration-200"
          >
            <ShieldAlert className="stroke-red-400" />
            <AlertTitle className="font-bold text-red-400">
              CRITICAL RISK ALERT
            </AlertTitle>
            <AlertDescription>{risk.message}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* TOP PANELS */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Quote Streaming Control */}
        <Card className="col-span-2 border-slate-800 bg-[#111827]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Quote Streaming (SI)
            </CardTitle>
            <span className="text-xs text-slate-500">Global</span>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <button
              onClick={handleToggleWorker}
              className={`flex items-center gap-2 rounded-md px-6 py-2 font-bold transition-all ${
                workerMetrics.isPaused
                  ? "border border-slate-700 bg-slate-800 text-slate-400"
                  : "border border-red-700 bg-red-900/80 text-red-100 shadow-[0_0_15px_rgba(153,27,27,0.5)] hover:bg-red-800"
              }`}
            >
              <AlertOctagon className="h-4 w-4" />
              {workerMetrics.isPaused ? "Resume Streaming" : "Halt All Quoting"}
            </button>
            <span
              className={`text-xs ${workerMetrics.isPaused ? "text-amber-500" : "text-teal-400"}`}
            >
              ● {workerMetrics.isPaused ? "Paused on SI" : "Live on SI"}
            </span>
          </CardContent>
        </Card>

        {/* Telemetry */}
        <MetricsCard fps={fps} workerMetrics={workerMetrics} />
      </div>

      {/* MAIN DATA GRID */}
      <PricesCard prices={prices} />
    </div>
  );
};
