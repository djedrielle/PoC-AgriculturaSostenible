import { cn } from "@/lib/utils";

interface SketchCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  serviceFile?: string;
}

export const SketchCard = ({ children, className, title, serviceFile }: SketchCardProps) => {
  return (
    <div className={cn("relative", className)}>
      <div className="bg-sketch-highlight border-2 border-sketch-border rounded-lg p-6 shadow-sm">
        {title && (
          <h3 className="text-xl font-semibold mb-4 text-foreground">
            {title}
          </h3>
        )}
        {children}
      </div>
      {serviceFile && (
        <div className="mt-2 text-xs text-muted-foreground font-mono">
          → {serviceFile}
        </div>
      )}
    </div>
  );
};
