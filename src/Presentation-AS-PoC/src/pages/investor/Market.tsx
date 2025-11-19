import { SketchCard } from "@/components/SketchCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

const availableTokens = [
  { id: 1, name: "Coffee Token A", price: 2.45, amount: 500, variety: "Arabica", harvest: "2024-06", producer: "Farm #156" },
  { id: 2, name: "Corn Token B", price: 1.80, amount: 1000, variety: "Yellow Dent", harvest: "2024-07", producer: "Farm #203" },
  { id: 3, name: "Wheat Token C", price: 3.20, amount: 750, variety: "Hard Red", harvest: "2024-08", producer: "Farm #087" },
];

export default function Market() {
  const [selectedToken, setSelectedToken] = useState<typeof availableTokens[0] | null>(null);
  const [buyAmount, setBuyAmount] = useState("");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Token Market</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SketchCard 
            title="Market View" 
            serviceFile="marketService.ts"
          >
            <div className="space-y-3">
              {availableTokens.map((token) => (
                <div 
                  key={token.id}
                  className="flex items-center justify-between p-4 bg-card rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setSelectedToken(token)}
                >
                  <div className="flex-1">
                    <p className="font-semibold">{token.name}</p>
                    <p className="text-sm text-muted-foreground">{token.producer}</p>
                  </div>
                  <div className="text-right mx-4">
                    <p className="font-bold text-primary">${token.price}</p>
                    <p className="text-sm text-muted-foreground">{token.amount} available</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    BUY
                  </Button>
                </div>
              ))}
            </div>
          </SketchCard>
        </div>

        <div className="space-y-6">
          <SketchCard 
            title="Production Info" 
            serviceFile="productionService.ts"
          >
            {selectedToken ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Variety</p>
                  <p className="font-medium">{selectedToken.variety}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Harvest Date</p>
                  <p className="font-medium">{selectedToken.harvest}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Token Price</p>
                  <p className="font-medium text-primary">${selectedToken.price}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Available</p>
                  <p className="font-medium">{selectedToken.amount} tokens</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Select a token to view details
              </p>
            )}
          </SketchCard>

          <SketchCard 
            title="Buy Tokens" 
            serviceFile="tokenService.ts"
          >
            {selectedToken ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buy-amount">Amount to buy</Label>
                  <Input 
                    id="buy-amount"
                    type="number"
                    placeholder="100"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    max={selectedToken.amount}
                  />
                </div>
                {buyAmount && (
                  <div className="p-3 bg-card rounded border border-border">
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="text-xl font-bold text-primary">
                      ${(parseFloat(buyAmount) * selectedToken.price).toFixed(2)}
                    </p>
                  </div>
                )}
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Confirm Purchase
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Select a token first
              </p>
            )}
          </SketchCard>
        </div>
      </div>
    </div>
  );
}
