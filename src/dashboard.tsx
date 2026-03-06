import { useEffect, useState } from "react";
import { WorkerMessageType, type RiskAlert, type Tick } from "./types";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

export const Dashboard = () => {
  const [prices, setPrices] = useState<Tick[]>([]);
  const [risk, setRisk] = useState<RiskAlert | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL("./data-worker.ts", import.meta.url));

    worker.onmessage = (event: MessageEvent) => {
      const message = event.data;

      if (message.type === WorkerMessageType.RISK_UPDATE) {
        setRisk(message.payload);

        setTimeout(() => {
          setRisk(null);
        }, 2500);
      }

      if (message.type === WorkerMessageType.BATCH_UPDATE) {
        setPrices(message.payload);
      }
    };

    return () => {
      worker.terminate();
    };
  }, []);

  return (
    <div className="min-h-screen space-y-6 bg-slate-950 p-8 font-sans text-white">
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Aviator Frontend PoC - Market Making Workstation
        </h1>
        <span className="rounded border border-slate-700 px-2 py-1 font-mono text-sm text-slate-500">
          Phase 1: Pure Web App PoC
        </span>
      </div>

      {/* RISK PANEL: Target < 50ms responsiveness */}
      <div className="h-20">
        {risk && (
          <Alert
            variant="destructive"
            className="animate-in fade-in zoom-in border-red-900 bg-red-950/50 text-red-200 duration-200"
          >
            <ShieldAlert className="h-4 w-4 stroke-red-400" />
            <AlertTitle className="font-bold text-red-400">
              CRITICAL RISK LIMIT
            </AlertTitle>
            <AlertDescription>{risk.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-slate-800 bg-slate-900 text-white shadow-xl lg:col-span-2">
          <CardHeader className="border-b border-slate-800 pb-4">
            <CardTitle className="flex justify-between text-sm font-medium text-slate-400">
              <span>Market Watch (Filtered to 60 FPS)</span>
              <span className="text-blue-400">
                {prices.length} Active Symbols
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="custom-scrollbar max-h-150 overflow-y-auto">
              <table className="w-full text-left font-mono text-sm">
                <thead className="sticky top-0 bg-slate-900 shadow-md">
                  <tr className="text-slate-500">
                    <th className="px-4 py-3 font-medium">Symbol</th>
                    <th className="px-4 py-3 text-right font-medium">Price</th>
                    <th className="px-4 py-3 text-right font-medium">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-8 text-center text-slate-600"
                      >
                        Waiting for data firehose...
                      </td>
                    </tr>
                  ) : (
                    prices.map((p) => (
                      <tr
                        key={p.symbol}
                        className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/20"
                      >
                        <td className="px-4 py-2 font-bold text-blue-400">
                          {p.symbol}
                        </td>
                        <td className="px-4 py-2 text-right text-green-400">
                          {p.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right text-slate-300">
                          {p.volume.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* SYSTEM METRICS PANEL */}
        <Card className="h-fit border-slate-800 bg-slate-900 text-white shadow-xl">
          <CardHeader className="border-b border-slate-800 pb-4">
            <CardTitle className="text-sm font-medium text-slate-400">
              System Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 font-mono text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target Throughput</span>
              <span className="rounded bg-emerald-400/10 px-2 py-1 font-bold text-emerald-400">
                40,000 / sec
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">UI Render Target</span>
              <span className="rounded bg-blue-400/10 px-2 py-1 font-bold text-blue-400">
                60 FPS (~16ms)
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-slate-400">Worker Status</span>
              <span className="flex items-center gap-2 text-green-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Active
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
