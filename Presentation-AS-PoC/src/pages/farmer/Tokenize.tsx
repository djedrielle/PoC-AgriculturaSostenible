import { SketchCard } from "@/components/SketchCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileCheck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { requestCertificate } from "@/api";
import { RequestCertificateSection } from "@/pages/farmer/RequestCertificate";


export default function Tokenize() {
  const [hasCertificate, setHasCertificate] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHasCertificate(true);
      toast({
        title: "Certificado cargado",
        description: `${file.name} se ha cargado correctamente.`,
      });
    }
  };

  const handleRequestCertificate = async () => {
    try {
      const response = await requestCertificate({
        user_id: "123",          
        institution_id: "456"    
      });

      toast({
        title: "Solicitud enviada",
        description: "El backend respondió correctamente.",
      });

      console.log("RESPONSE:", response);

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo enviar la solicitud",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Product Tokenization</h1>
      
      <SketchCard 
        title="Upload Validation Certificate" 
        serviceFile="productionService.ts"
      >
        <div className="space-y-4">
          {!hasCertificate ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-border rounded-lg bg-card">
                <Upload className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground">No certificate uploaded</p>
                <input
                  type="file"
                  id="certificate-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button 
                  onClick={() => document.getElementById('certificate-upload')?.click()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Certificate
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-border"></div>
                <span className="text-sm text-muted-foreground">o</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              <Button 
                onClick={handleRequestCertificate}
                variant="outline"
                className="w-full"
              >
                <FileCheck className="w-4 h-4 mr-2" />
                Request Certificate
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fruit">Fruit/Grain</Label>
                  <Input id="fruit" placeholder="e.g., Coffee, Corn" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="1000" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="variety">Variety</Label>
                  <Input id="variety" placeholder="e.g., Arabica" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="harvest-date">Estimated Harvest Date</Label>
                  <Input id="harvest-date" type="date" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">Measurement Unit</Label>
                  <Input id="unit" placeholder="kg, tons, bushels" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Region, Country" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="agro-conditions">Agro Conditions</Label>
                <Input id="agro-conditions" placeholder="Climate, soil type..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agro-protocols">Agro Protocols</Label>
                <Input id="agro-protocols" placeholder="Organic, conventional..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio-features">Biologic Features</Label>
                <Input id="bio-features" placeholder="Certifications, quality..." />
              </div>

              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" size="lg">
                Publish Tokens
              </Button>
            </>
          )}
        </div>
      </SketchCard>
    </div>
  );
}
