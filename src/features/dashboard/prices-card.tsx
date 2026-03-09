import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tick } from "@/types";

interface Props {
  prices: Tick[];
}

const PricesCard = ({ prices }: Props) => {
  return (
    <Card className="border-slate-800 bg-slate-900 text-white shadow-xl lg:col-span-2">
      <CardHeader className="border-b border-slate-800 pb-4">
        <CardTitle className="flex justify-between text-sm font-medium text-slate-400">
          <span>Market Watch (Filtered to 60 FPS)</span>
          <span className="text-blue-400">{prices.length} Active Symbols</span>
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
                  <td colSpan={3} className="py-8 text-center text-slate-600">
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
  );
};

export default PricesCard;
