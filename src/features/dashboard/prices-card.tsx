import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tick } from "../../types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  prices: Tick[];
}

const PricesCard = ({ prices }: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: prices.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const gridTemplate =
    "grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]";

  return (
    <Card className="overflow-hidden border-t-2 border-slate-800 border-t-blue-500/30 bg-[#111827] shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 bg-[#1A2333] px-4 py-3">
        <CardTitle className="text-sm font-medium text-slate-300">
          Instrument Controls (Global)
        </CardTitle>
        <span className="font-mono text-xs text-slate-500">
          Weights + Spread Configuration
        </span>
      </CardHeader>

      <CardContent className="p-0">
        <div
          ref={parentRef}
          className="custom-scrollbar relative max-h-150 overflow-auto"
        >
          <div className="w-full min-w-300 text-left font-mono text-[11px]">
            <div
              className={cn(
                "sticky top-0 z-10 grid border-b border-slate-800 bg-[#1A2333] text-slate-400 shadow-md",
                gridTemplate,
              )}
            >
              <div className="p-3 font-semibold">ISIN</div>
              <div className="p-3 font-semibold">Name</div>
              <div className="p-3 text-right font-semibold">Quoted Mid</div>
              <div className="p-3 text-right font-semibold">Xetra Spr</div>
              <div className="p-3 text-right font-semibold">LSX Spr</div>
              <div className="p-3 text-right font-semibold">gettex Spr</div>
              <div className="border-r border-slate-800 p-3 text-right font-semibold">
                Tradegate Spr
              </div>
              <div className="bg-blue-950/20 p-3 text-center font-semibold">
                Xetra %
              </div>
              <div className="bg-blue-950/20 p-3 text-center font-semibold">
                LSX %
              </div>
              <div className="bg-blue-950/20 p-3 text-center font-semibold">
                gettex %
              </div>
              <div className="bg-blue-950/20 p-3 text-center font-semibold">
                Trdgate %
              </div>
              <div className="p-3 text-right font-semibold">Weight Total</div>
            </div>

            {/* VIRTUALIZED BODY - Block container for height */}
            <div
              className="relative block w-full"
              style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
            >
              {prices.length === 0 ? (
                <div className="absolute flex w-full justify-center py-8 text-slate-600">
                  Waiting for data...
                </div>
              ) : (
                rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const p = prices[virtualRow.index];
                  return (
                    // VIRTUAL ROW - Apply the exact same gridTemplate here!
                    <div
                      key={p.isin}
                      className={`absolute grid w-full items-center border-b border-slate-800/40 transition-colors hover:bg-[#1E293B] ${gridTemplate}`}
                      style={{
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <div className="px-3 text-slate-300">{p.isin}</div>
                      <div className="truncate px-3 text-slate-500">
                        {p.name}
                      </div>
                      <div className="px-3 text-right font-bold text-teal-400">
                        {p.xetra_mid.toFixed(2)}
                      </div>
                      <div className="px-3 text-right text-slate-400">
                        {p.xetra_spr.toFixed(2)}
                      </div>
                      <div className="px-3 text-right text-slate-400">
                        {p.lsx_spr.toFixed(2)}
                      </div>
                      <div className="px-3 text-right text-slate-400">
                        {p.gettex_spr.toFixed(2)}
                      </div>
                      {/* Note: Check your tick type, you had trade_gate_spr in your code but it might be tradegate_spr */}
                      <div className="border-r border-slate-800 px-3 text-right text-slate-400">
                        {p.trade_gate_spr?.toFixed(2) || "0.00"}
                      </div>

                      {/* INTERACTIVE INPUTS */}
                      <div className="flex justify-center bg-blue-950/10 px-2 py-1">
                        <input
                          type="number"
                          defaultValue={45}
                          className="w-12 rounded border border-slate-700 bg-slate-900 py-0.5 text-center text-slate-300 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-center bg-blue-950/10 px-2 py-1">
                        <input
                          type="number"
                          defaultValue={20}
                          className="w-12 rounded border border-slate-700 bg-slate-900 py-0.5 text-center text-slate-300 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-center bg-blue-950/10 px-2 py-1">
                        <input
                          type="number"
                          defaultValue={20}
                          className="w-12 rounded border border-slate-700 bg-slate-900 py-0.5 text-center text-slate-300 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-center bg-blue-950/10 px-2 py-1">
                        <input
                          type="number"
                          defaultValue={15}
                          className="w-12 rounded border border-slate-700 bg-slate-900 py-0.5 text-center text-slate-300 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div className="px-3 text-right text-slate-500">100%</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricesCard;
