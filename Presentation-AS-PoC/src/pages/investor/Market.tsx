import { SketchCard } from "@/components/SketchCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { getMarketTokens, buyTokens } from "@/api";
import { useToast } from "@/hooks/use-toast";

export default function Market() {
  const [availableTokens, setAvailableTokens] = useState<any[]>([]);
  const [selectedToken, setSelectedToken] = useState<any | null>(null);
  const [buyAmount, setBuyAmount] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const tokens = await getMarketTokens();
      setAvailableTokens(tokens);
    } catch (error) {
      console.error("Error fetching market tokens:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los tokens del mercado",
        variant: "destructive",
      });
    }
  };

  const handleBuy = async () => {
    if (!selectedToken || !buyAmount) return;

    try {
      await buyTokens({
        token_name: selectedToken.token_name,
        token_amount_transferred: parseFloat(buyAmount),
        token_unit_price: parseFloat(selectedToken.current_token_price_usd),
        platform_comition: 0.02, // 2% commission
        buyer_id: 1, // TODO: Real user ID
        seller_id: selectedToken.token_owner_id
      });

      toast({
        title: "Compra exitosa",
        description: `Has comprado ${buyAmount} tokens de ${selectedToken.token_name}`,
      });

      // Refresh market
      fetchTokens();
      setBuyAmount("");
      setSelectedToken(null);

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Error al comprar tokens",
        variant: "destructive",
      });
    }
  };

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
              {availableTokens.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No tokens available</p>
              ) : (
                availableTokens.map((token) => (
                  <div
                    key={token.token_name}
                    className={`flex items-center justify-between p-4 bg-card rounded-lg border-2 transition-colors cursor-pointer ${selectedToken?.token_name === token.token_name ? 'border-primary' : 'border-border hover:border-primary/50'}`}
                    onClick={() => setSelectedToken(token)}
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{token.token_name}</p>
                      <p className="text-sm text-muted-foreground">Owner ID: {token.token_owner_id}</p>
                    </div>
                    <div className="text-right mx-4">
                      <p className="font-bold text-primary">${token.current_token_price_usd}</p>
                      <p className="text-sm text-muted-foreground">{token.amount_tokens_on_market} available</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedToken(token);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      SELECT
                    </Button>
                  </div>
                ))
              )}
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
                  <p className="text-muted-foreground">Token Name</p>
                  <p className="font-medium">{selectedToken.token_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Token Price</p>
                  <p className="font-medium text-primary">${selectedToken.current_token_price_usd}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Available</p>
                  <p className="font-medium">{selectedToken.amount_tokens_on_market} tokens</p>
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
                    max={selectedToken.amount_tokens_on_market}
                  />
                </div>
                {buyAmount && (
                  <div className="p-3 bg-card rounded border border-border">
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="text-xl font-bold text-primary">
                      ${(parseFloat(buyAmount) * parseFloat(selectedToken.current_token_price_usd)).toFixed(2)}
                    </p>
                  </div>
                )}
                <Button
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  onClick={handleBuy}
                >
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
