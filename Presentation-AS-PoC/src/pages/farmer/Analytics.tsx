import { SketchCard } from "@/components/SketchCard";
import { TrendingUp, DollarSign, ShoppingBag } from "lucide-react";

export default function Analytics() {
  const tokenValue = 2.45;
  const tokensCreated = 10000;
  const tokensOnMarket = 7500;
  const marketValue = tokenValue * tokensOnMarket;

  const priceHistory = [
    { week: "W1", price: 2.1 },
    { week: "W2", price: 2.3 },
    { week: "W3", price: 2.2 },
    { week: "W4", price: 2.45 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SketchCard title="Current Token Value" className="col-span-1">
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <DollarSign className="w-8 h-8" />
            ${tokenValue.toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">USD per token</p>
        </SketchCard>

        <SketchCard title="Amount Tokens Created" className="col-span-1">
          <div className="text-3xl font-bold text-secondary flex items-center gap-2">
            <ShoppingBag className="w-8 h-8" />
            {tokensCreated.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Total supply</p>
        </SketchCard>

        <SketchCard title="Tokens on Market" className="col-span-1">
          <div className="text-3xl font-bold text-accent flex items-center gap-2">
            <TrendingUp className="w-8 h-8" />
            {tokensOnMarket.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Available for trading</p>
        </SketchCard>
      </div>

      <SketchCard 
        title="Token Value Evolution" 
        serviceFile="analyticsService.ts"
      >
        <div className="space-y-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <p className="text-lg font-semibold mb-2">Market Value</p>
            <p className="text-2xl font-bold text-primary">
              ${marketValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">
              = {tokenValue} × {tokensOnMarket.toLocaleString()} tokens
            </p>
          </div>

          <div className="h-64 flex items-end justify-around gap-4 p-4 bg-card rounded-lg border border-border">
            {priceHistory.map((data) => (
              <div key={data.week} className="flex flex-col items-center gap-2">
                <div 
                  className="w-16 bg-primary rounded-t"
                  style={{ height: `${(data.price / 2.5) * 200}px` }}
                />
                <p className="text-sm font-medium">{data.week}</p>
                <p className="text-xs text-muted-foreground">${data.price}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-card rounded-lg border border-border">
            <p className="font-medium mb-2">Negotiation Volume (Last 7 days)</p>
            <p className="text-xl font-bold">1,250 tokens</p>
            <p className="text-sm text-muted-foreground">~$3,062.50 USD</p>
          </div>
        </div>
      </SketchCard>
    </div>
  );
}
