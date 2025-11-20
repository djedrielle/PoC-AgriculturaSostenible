import { useState } from "react";
import { SketchCard } from "@/components/SketchCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Validation() {
  const [isAffiliated, setIsAffiliated] = useState(false);
  const [institution, setInstitution] = useState("");
  const [tokenName, setTokenName] = useState("");
  const { toast } = useToast();

  const certificates = [
    { id: 1, date: "2024-01-15", status: "Active", agent: "Dr. Maria Lopez" },
    { id: 2, date: "2023-06-20", status: "Expired", agent: "Dr. Juan Martinez" },
  ];

  const handleAffiliate = () => {
    if (!institution || !tokenName) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    setIsAffiliated(true);
    toast({
      title: "Afiliación exitosa",
      description: `Te has afiliado a ${institution}`,
    });
  };

  if (!isAffiliated) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Validation Info</h1>
        
        <SketchCard 
          title="Affiliate To An Institution"
          serviceFile="validationService.ts"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="institution">Choose an institution</Label>
              <Select value={institution} onValueChange={setInstitution}>
                <SelectTrigger id="institution">
                  <SelectValue placeholder="ICAA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ICAA">ICAA</SelectItem>
                  <SelectItem value="IICA">Instituto Interamericano de Cooperación para la Agricultura</SelectItem>
                  <SelectItem value="FAO">FAO Costa Rica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tokenName">Set a name for your token</Label>
              <Input
                id="tokenName"
                placeholder="Ingresa el nombre del token"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleAffiliate}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Affiliate
            </Button>

            <p className="text-xs text-muted-foreground text-right font-mono">
              * Farmer first logging in
            </p>
          </div>
        </SketchCard>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Validation Information</h1>
      
      <SketchCard 
        title="Instituto Interamericano de Cooperación para la Agricultura"
        serviceFile="validationService.ts"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 p-4 bg-card rounded-lg border border-border">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Affiliation Info</p>
              <p className="font-medium">Member #AG-2024-0156</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Issue Date</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Jan 15, 2024
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Exp. Date</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Jan 15, 2026
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Assigned Agent</p>
              <p className="font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Dr. Maria Lopez
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Certificate History
            </h4>
            <div className="space-y-2">
              {certificates.map((cert) => (
                <div 
                  key={cert.id}
                  className="flex items-center justify-between p-3 bg-card rounded border border-border"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{cert.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{cert.agent}</span>
                    <Badge variant={cert.status === "Active" ? "default" : "secondary"}>
                      {cert.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SketchCard>
    </div>
  );
}
