import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sprout, TrendingUp, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-sketch-highlight/30 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            AgroToken Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Blockchain-powered agricultural tokenization platform connecting farmers, investors, and validation institutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-card border-2 border-sketch-border rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Sprout className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-4">Farmer</h2>
            <p className="text-muted-foreground text-center mb-6">
              Tokenize your agricultural production and access global markets
            </p>
            <Link to="/farmer/tokenize" className="block">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Enter Farmer Portal
              </Button>
            </Link>
          </div>

          <div className="bg-card border-2 border-sketch-border rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <TrendingUp className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-4">Investor</h2>
            <p className="text-muted-foreground text-center mb-6">
              Invest in agricultural tokens and diversify your portfolio
            </p>
            <Link to="/investor/market" className="block">
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Enter Investor Portal
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/login">
            <Button variant="outline" size="lg">
              Login
            </Button>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-sketch-highlight border-2 border-sketch-border rounded-lg p-6 max-w-2xl">
            <p className="text-sm font-mono text-muted-foreground mb-2">
              Powered by Blockchain Technology
            </p>
            <p className="text-foreground">
              Secure, transparent, and efficient agricultural asset tokenization with full traceability and validation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
