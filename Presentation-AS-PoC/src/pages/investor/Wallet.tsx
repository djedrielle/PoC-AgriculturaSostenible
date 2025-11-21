import { SketchCard } from "@/components/SketchCard";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { getWalletTokens } from "@/api";
import { useToast } from "@/hooks/use-toast";

export default function Wallet() {
  const [walletTokens, setWalletTokens] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchWallet();
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

  const totalValue = walletTokens.reduce((acc, token) => {
    return acc + (parseFloat(token.amount_tokens_on_wallet) * parseFloat(token.token_price_usd));
  }, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">My Wallet</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
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
                        className="flex items-center justify-between p-4 bg-card rounded-lg border border-border"
                      >
                        <div>
                          <p className="font-medium">{token.token_name}</p>
                          <p className="text-sm text-muted-foreground">{token.amount_tokens_on_wallet} tokens</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${(parseFloat(token.amount_tokens_on_wallet) * parseFloat(token.token_price_usd)).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">${token.token_price_usd}/token</p>
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
            title="Quick Actions"
            serviceFile="tokenService.ts"
          >
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <ArrowUpRight className="w-4 h-4 mr-2 text-green-600" />
                Deposit Funds
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ArrowDownLeft className="w-4 h-4 mr-2 text-red-600" />
                Withdraw Funds
              </Button>
            </div>
          </SketchCard>

          <SketchCard
            title="Recent Activity"
            serviceFile="transactionService.ts"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Bought Coffee Token A</p>
                  <p className="text-xs text-muted-foreground">Today, 10:23 AM</p>
                </div>
                <p className="font-medium text-red-600">-$245.00</p>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Deposit</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
                <p className="font-medium text-green-600">+$1,000.00</p>
              </div>
            </div>
          </SketchCard>
        </div>
      </div>
    </div>
  );
}
