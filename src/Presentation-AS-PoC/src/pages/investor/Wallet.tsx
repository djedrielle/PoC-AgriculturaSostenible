import { SketchCard } from "@/components/SketchCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet as WalletIcon, TrendingUp, TrendingDown } from "lucide-react";

const myTokens = [
  { 
    id: 1, 
    name: "Coffee Token A", 
    purchasePrice: 2.30, 
    currentPrice: 2.45,
    amount: 100, 
    previousOwner: "Farm #156" 
  },
  { 
    id: 2, 
    name: "Wheat Token C", 
    purchasePrice: 3.50, 
    currentPrice: 3.20,
    amount: 50, 
    previousOwner: "Farm #087" 
  },
];

export default function WalletPage() {
  const totalValue = myTokens.reduce((sum, token) => sum + (token.currentPrice * token.amount), 0);
  const totalInvested = myTokens.reduce((sum, token) => sum + (token.purchasePrice * token.amount), 0);
  const profit = totalValue - totalInvested;
  const profitPercentage = ((profit / totalInvested) * 100).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">My Wallet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SketchCard title="Total Portfolio Value">
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <WalletIcon className="w-8 h-8" />
            ${totalValue.toFixed(2)}
          </div>
        </SketchCard>

        <SketchCard title="Total Invested">
          <div className="text-3xl font-bold text-secondary">
            ${totalInvested.toFixed(2)}
          </div>
        </SketchCard>

        <SketchCard title="Profit/Loss">
          <div className={`text-3xl font-bold flex items-center gap-2 ${profit >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {profit >= 0 ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
            ${Math.abs(profit).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {profit >= 0 ? '+' : ''}{profitPercentage}%
          </p>
        </SketchCard>
      </div>

      <SketchCard 
        title="My Holdings" 
        serviceFile="walletService.ts, tokenService.ts"
      >
        <div className="space-y-4">
          {myTokens.map((token) => {
            const tokenProfit = (token.currentPrice - token.purchasePrice) * token.amount;
            const tokenProfitPercent = ((tokenProfit / (token.purchasePrice * token.amount)) * 100).toFixed(2);
            
            return (
              <div 
                key={token.id}
                className="p-4 bg-card rounded-lg border-2 border-border space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-lg">{token.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Previous Owner: {token.previousOwner}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Holdings</p>
                    <p className="font-bold">{token.amount} tokens</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-3 bg-background rounded border border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Purchase Price</p>
                    <p className="font-medium">${token.purchasePrice}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Current Price</p>
                    <p className="font-medium text-primary">${token.currentPrice}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Profit/Loss</p>
                    <p className={`font-medium ${tokenProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                      {tokenProfit >= 0 ? '+' : ''}${tokenProfit.toFixed(2)} ({tokenProfitPercent}%)
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <Input type="number" placeholder="Amount to sell" max={token.amount} />
                  </div>
                  <Button variant="outline" className="whitespace-nowrap">
                    Sell Tokens
                  </Button>
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 whitespace-nowrap">
                    Set on Market
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </SketchCard>
    </div>
  );
}
