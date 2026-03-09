import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export interface Metrics {
  throughput: number;
  isPaused: boolean;
}

interface Props {
  fps: number;
  workerMetrics: Metrics;
}

export const MetricsCard = ({ fps, workerMetrics }: Props) => {
  return (
    <Card className="h-fit border-slate-800 bg-[#111827] text-white">
      <CardHeader className="border-b border-slate-800 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-400">
          <Activity className="h-4 w-4" /> System Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-4 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Throughput</span>
          <span className="text-teal-400">
            {workerMetrics.throughput.toLocaleString()} / sec
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">UI Paint</span>
          <span className="text-blue-400">{fps} FPS</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-800 pt-2">
          <span className="text-slate-500">Data Feed</span>
          {workerMetrics.isPaused ? (
            <span className="font-bold text-amber-500">Halted</span>
          ) : (
            <span className="text-green-500">Live</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
