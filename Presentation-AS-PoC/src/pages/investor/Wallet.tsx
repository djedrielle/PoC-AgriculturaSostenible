import { SketchCard } from "@/components/SketchCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { getWalletTokens, sellTokens, getRecentTransactions } from "@/api";
import { useToast } from "@/hooks/use-toast";

export default function Wallet() {
  const [walletTokens, setWalletTokens] = useState<any[]>([]);
  const [selectedToken, setSelectedToken] = useState<any | null>(null);
  const [sellAmount, setSellAmount] = useState("");
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchWallet();
    fetchActivity();
  }, []);

  const fetchWallet = async () => {
    try {
      const tokens = await getWalletTokens({ user_id: 1 }); // TODO: Real user ID
      setWalletTokens(tokens);
    } catch (error) {
      console.error("Error fetching wallet tokens:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los tokens de la billetera",
        variant: "destructive",
      });
    }
  };

  const fetchActivity = async () => {
    try {
      const activity = await getRecentTransactions({ user_id: 1 }); // TODO: Real user ID
      setRecentActivity(activity);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    }
  };

  const handleSell = async () => {
    if (!selectedToken || !sellAmount) return;

    try {
      await sellTokens({
        seller_id: 1, // TODO: Real user ID
        token_name: selectedToken.token_name,
        amount: parseFloat(sellAmount),
        token_unit_price: parseFloat(selectedToken.token_price_usd)
      });

      toast({
        title: "Venta exitosa",
        description: `Has vendido ${sellAmount} tokens de ${selectedToken.token_name}`,
      });

      // Refresh data
      fetchWallet();
      fetchActivity();
      setSellAmount("");
      setSelectedToken(null);

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Error al vender tokens",
        variant: "destructive",
      });
    }
  };

  const totalValue = walletTokens.reduce((acc, token) => {
    return acc + (parseFloat(token.amount_tokens_on_wallet) * parseFloat(token.token_price_usd));
  }, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">My Wallet</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SketchCard
            title="Portfolio Overview"
            serviceFile="walletService.ts"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="p-3 bg-primary text-primary-foreground rounded-full">
                  <WalletIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                  <p className="text-3xl font-bold text-primary">${totalValue.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Your Tokens</h3>
                <div className="space-y-3">
                  {walletTokens.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No tokens in wallet</p>
                  ) : (
                    walletTokens.map((token) => (
                      <div
                        key={token.token_name}
                        className={`flex items-center justify-between p-4 bg-card rounded-lg border-2 transition-colors cursor-pointer ${selectedToken?.token_name === token.token_name ? 'border-primary' : 'border-border hover:border-primary/50'}`}
                        onClick={() => setSelectedToken(token)}
                      >
                        <div>
                          <p className="font-medium">{token.token_name}</p>
                          <p className="text-sm text-muted-foreground">{token.amount_tokens_on_wallet} tokens</p>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p className="font-bold">${(parseFloat(token.amount_tokens_on_wallet) * parseFloat(token.token_price_usd)).toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">${token.token_price_usd}/token</p>
                          </div>
                          <Button
                            size="sm"
                            variant={selectedToken?.token_name === token.token_name ? "default" : "secondary"}
                          >
                            {selectedToken?.token_name === token.token_name ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </SketchCard>
        </div>

        <div className="space-y-6">
          <SketchCard
            title="Token Actions"
            serviceFile="tokenService.ts"
          >
            {selectedToken ? (
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Selected Token</p>
                  <p className="text-lg font-bold">{selectedToken.token_name}</p>
                  <p className="text-sm text-primary">Available: {selectedToken.amount_tokens_on_wallet}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sell-amount">Amount to Sell</Label>
                  <div className="relative">
                    <Input
                      id="sell-amount"
                      type="number"
                      placeholder="0.00"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(e.target.value)}
                      max={selectedToken.amount_tokens_on_wallet}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-7 text-xs"
                      onClick={() => setSellAmount(selectedToken.amount_tokens_on_wallet)}
                    >
                      MAX
                    </Button>
                  </div>
                </div>

                {sellAmount && (
                  <div className="p-3 bg-card rounded border border-border">
                    <p className="text-sm text-muted-foreground">Estimated Return</p>
                    <p className="text-xl font-bold text-green-600">
                      ${(parseFloat(sellAmount) * parseFloat(selectedToken.token_price_usd)).toFixed(2)}
                    </p>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleSell}
                  disabled={!sellAmount || parseFloat(sellAmount) <= 0 || parseFloat(sellAmount) > parseFloat(selectedToken.amount_tokens_on_wallet)}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Confirm Sale
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <WalletIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Select a token from your portfolio to view actions</p>
              </div>
            )}
          </SketchCard>

          <SketchCard
            title="Recent Activity"
            serviceFile="transactionService.ts"
          >
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No recent transactions</p>
              ) : (
                recentActivity.map((tx) => (
                  <div key={tx.transaction_id} className="flex items-center gap-3 text-sm p-2 hover:bg-muted/50 rounded transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.buyer_id === 1 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {tx.buyer_id === 1 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{tx.buyer_id === 1 ? 'Bought' : 'Sold'} {tx.token_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.transaction_date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={`font-medium ${tx.buyer_id === 1 ? 'text-red-600' : 'text-green-600'}`}>
                      {tx.buyer_id === 1 ? '-' : '+'}${parseFloat(tx.token_amount_transfered * tx.token_unit_price).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </SketchCard>
        </div>
      </div>
    </div>
  );
}
