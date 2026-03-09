import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tick } from "@/types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

interface Props {
  prices: Tick[];
}

const PricesCard = ({ prices }: Props) => {
  // We need a ref for the scrollable container so TanStack knows the dimensions
  const parentRef = useRef<HTMLDivElement>(null);

  // --- TANSTACK VIRTUALIZER SETUP ---
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: prices.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36, // Estimate each row is 36px high
    overscan: 5, // Render 5 rows off-screen for smoother scrolling
  });

  return (
    <Card className="border-slate-800 bg-slate-900 text-white shadow-xl lg:col-span-2">
      <CardHeader className="border-b border-slate-800 pb-4">
        <CardTitle className="flex justify-between text-sm font-medium text-slate-400">
          <span>Market Watch (60 FPS + TanStack Virtual)</span>
          <span className="text-blue-400">{prices.length} Active Symbols</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={parentRef}
          className="custom-scrollbar relative max-h-150 overflow-auto"
        >
          <table className="grid w-full text-left font-mono text-sm">
            <thead className="sticky top-0 z-10 grid bg-slate-900 shadow-md">
              <tr className="flex w-full border-b border-slate-800 text-slate-500">
                <th className="w-1/3 px-4 py-3 font-medium">Symbol</th>
                <th className="w-1/3 px-4 py-3 text-right font-medium">
                  Price
                </th>
                <th className="w-1/3 px-4 py-3 text-right font-medium">
                  Volume
                </th>
              </tr>
            </thead>
            <tbody
              className="relative block w-full"
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
              }}
            >
              {prices.length === 0 ? (
                <tr className="absolute inset-0 flex w-full items-center justify-center text-slate-600">
                  <td className="flex w-full justify-center px-4 py-8">
                    Waiting for data...
                  </td>
                </tr>
              ) : (
                rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const p = prices[virtualRow.index];
                  return (
                    <tr
                      key={p.symbol}
                      className="absolute flex w-full border-b border-slate-800/50 transition-colors hover:bg-slate-800/20"
                      style={{
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <td className="text-secondary flex w-1/3 items-center px-4 py-2 font-bold">
                        {p.symbol}
                      </td>
                      <td className="text-primary flex w-1/3 items-center justify-end px-4 py-2 text-right">
                        {p.price.toFixed(2)}
                      </td>
                      <td className="text-secondary flex w-1/3 items-center justify-end px-4 py-2 text-right">
                        {p.volume.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricesCard;
