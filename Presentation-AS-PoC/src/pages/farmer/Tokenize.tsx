import { SketchCard } from "@/components/SketchCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sprout, MapPin, ClipboardList, Coins } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { tokenizeAsset, TokenizePayload } from "@/api";

export default function Tokenize() {
  const { toast } = useToast();

  // Form states
  const [fruit, setFruit] = useState("");
  const [amount, setAmount] = useState("");
  const [variety, setVariety] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [unit, setUnit] = useState("");
  const [location, setLocation] = useState("");
  const [agroConditions, setAgroConditions] = useState("");
  const [agroProtocols, setAgroProtocols] = useState("");
  const [bioFeatures, setBioFeatures] = useState("");

  // Token states
  const [tokenPrice, setTokenPrice] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [tokenName, setTokenName] = useState("");

  useEffect(() => {
    const savedTokenName = localStorage.getItem('farmerTokenName');
    if (savedTokenName) {
      setTokenName(savedTokenName);
    }
  }, []);

  const handleTokenize = async () => {
    if (!tokenPrice || !tokenAmount || parseFloat(tokenPrice) <= 0 || parseInt(tokenAmount) <= 0) {
      toast({
        title: "Error de validación",
        description: "Por favor ingrese un precio y cantidad de tokens válidos.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload: TokenizePayload = {
        smart_contract_data: {
          contract_address: "address_1",
          standard_implemented: "ERC-20",
          initial_token_price: parseFloat(tokenPrice) || 0,
          total_tokens: parseInt(tokenAmount) || 0,
          emition_date: new Date().toISOString().split('T')[0],
          active: true,
          contract_state: "ACTIVO"
        },
        production_data: {
          location: location,
          farmer_id: 1, // TODO: Use real user ID
          crop_type: fruit,
          crop_variety: variety,
          est_harvest_date: harvestDate,
          amount: parseFloat(amount) || 0,
          measure_unit: unit,
          biologic_features: bioFeatures,
          agro_conditions: agroConditions,
          agro_protocols: agroProtocols,
          active: true
        },
        token_data: {
          type: tokenName || "Agricultural Token",
          token_name: tokenName || `${fruit}Token`,
          emition_date: new Date().toISOString().split('T')[0],
          token_price_USD: parseFloat(tokenPrice) || 0,
          amount_tokens: parseInt(tokenAmount) || 0,
          owner_id: 1 // TODO: Use real user ID
        }
      };

      console.log("Sending Payload:", JSON.stringify(payload, null, 2));

      await tokenizeAsset(payload);

      toast({
        title: "Éxito",
        description: "Activo tokenizado correctamente",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Error al tokenizar",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Tokenization</h1>
          <p className="text-muted-foreground mt-1">Transform your agricultural assets into digital tokens.</p>
        </div>
      </div>

      <SketchCard
        title="Production Information"
        serviceFile="productionService.ts"
      >
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Section 1: Crop Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Sprout className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Crop Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fruit">Fruit / Grain</Label>
                <Select value={fruit} onValueChange={setFruit}>
                  <SelectTrigger id="fruit">
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coffee">Coffee</SelectItem>
                    <SelectItem value="Corn">Corn</SelectItem>
                    <SelectItem value="Wheat">Wheat</SelectItem>
                    <SelectItem value="Soy">Soy</SelectItem>
                    <SelectItem value="Rice">Rice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="variety">Variety</Label>
                <Input
                  id="variety"
                  placeholder="e.g., Arabica, Robusta"
                  value={variety}
                  onChange={e => setVariety(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Measurement Unit</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="tons">Tons</SelectItem>
                    <SelectItem value="bushels">Bushels</SelectItem>
                    <SelectItem value="lb">Pounds (lb)</SelectItem>
                    <SelectItem value="cajuelas">Cajuelas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 2: Harvest & Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Harvest & Location</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="harvest-date">Estimated Harvest Date</Label>
                <Input
                  id="harvest-date"
                  type="date"
                  value={harvestDate}
                  onChange={e => setHarvestDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Origin Location</Label>
                <Input
                  id="location"
                  placeholder="Region, Country"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Agricultural Standards */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Agricultural Standards</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bio-features">Biologic Features</Label>
                <Textarea
                  id="bio-features"
                  placeholder="Describe genetic traits, quality certifications, or specific biological characteristics..."
                  className="min-h-[80px]"
                  value={bioFeatures}
                  onChange={e => setBioFeatures(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="agro-conditions">Agro Conditions</Label>
                  <Textarea
                    id="agro-conditions"
                    placeholder="Climate details, soil type, altitude..."
                    className="min-h-[80px]"
                    value={agroConditions}
                    onChange={e => setAgroConditions(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agro-protocols">Agro Protocols</Label>
                  <Textarea
                    id="agro-protocols"
                    placeholder="Farming methods (Organic, Conventional), fertilizers used..."
                    className="min-h-[80px]"
                    value={agroProtocols}
                    onChange={e => setAgroProtocols(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Token Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Coins className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Token Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="token-price">Token Price (USD)</Label>
                <Input
                  id="token-price"
                  type="number"
                  placeholder="10.00"
                  value={tokenPrice}
                  onChange={e => setTokenPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token-amount">Number of Tokens</Label>
                <Input
                  id="token-amount"
                  type="number"
                  placeholder="100"
                  value={tokenAmount}
                  onChange={e => setTokenAmount(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button
              onClick={handleTokenize}
              className="w-full h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              Publish Asset Tokens
            </Button>
          </div>
        </div>
      </SketchCard>
    </div>
  );
}
