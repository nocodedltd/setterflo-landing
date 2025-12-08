import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface ChartShellProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  height?: string;
}

export function ChartShell({ 
  title, 
  description, 
  actions, 
  children, 
  className,
  height = "h-[350px]" 
}: ChartShellProps) {
  return (
    <Card className={cn("glass-panel border-white/[0.08] flex flex-col h-full", className)}>
      <CardHeader className="flex flex-row items-start justify-between border-b border-white/[0.06] pb-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold tracking-tight text-white">{title}</CardTitle>
          {description && <CardDescription className="text-xs text-text-secondary font-medium">{description}</CardDescription>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardContent className="p-6 flex-1 min-h-0">
        <div className={cn("w-full", height)}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
