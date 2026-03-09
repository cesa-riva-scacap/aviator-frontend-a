import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, PauseCircle, PlayCircle } from "lucide-react";

export interface Metrics {
  throughput: number;
  isPaused: boolean;
}

interface Props {
  fps: number;
  workerMetrics: Metrics;
  onToggleWorker: () => void;
}

export const MetricsCard = ({ fps, workerMetrics, onToggleWorker }: Props) => {
  return (
    <Card className="h-fit border-slate-800 bg-slate-900 text-white shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-400">
          <Activity className="h-4 w-4" /> Live Telemetry
        </CardTitle>
        <button
          onClick={onToggleWorker}
          className={`rounded-md p-1.5 transition-colors ${workerMetrics.isPaused ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
          title={workerMetrics.isPaused ? "Resume Data" : "Pause Data"}
        >
          {workerMetrics.isPaused ? (
            <PlayCircle className="h-5 w-5" />
          ) : (
            <PauseCircle className="h-5 w-5" />
          )}
        </button>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 font-mono text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Actual Throughput</span>
          <span
            className={`rounded px-2 py-1 font-bold transition-colors ${workerMetrics.throughput > 0 ? "bg-emerald-400/10 text-emerald-400" : "bg-slate-800 text-slate-500"}`}
          >
            {workerMetrics.throughput.toLocaleString()} / sec
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">UI Paint Rate (FPS)</span>
          <span
            className={`rounded px-2 py-1 font-bold ${fps >= 55 ? "bg-blue-400/10 text-blue-400" : "bg-amber-400/10 text-amber-400"}`}
          >
            {fps} FPS
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <span className="text-slate-400">Worker Status</span>
          {workerMetrics.isPaused ? (
            <span className="flex items-center gap-2 font-bold text-amber-500">
              Paused
            </span>
          ) : (
            <span className="flex items-center gap-2 text-green-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              Processing
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
