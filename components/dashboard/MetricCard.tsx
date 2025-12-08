import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  description?: string;
  icon?: React.ReactNode;
  trendColor?: string; // Optional override
}

export function MetricCard({ title, value, change, description, icon, trendColor }: MetricCardProps) {
  return (
    <Card className="glass-card group relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-text-muted group-hover:text-primary-400 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-300">
            {icon}
          </div>
          {change && (
            <div className={cn(
              "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-sm",
              change.trend === 'up' 
                ? "bg-success-500/10 text-success-500 border-success-500/20" 
                : change.trend === 'down'
                ? "bg-error-500/10 text-error-500 border-error-500/20"
                : "bg-white/5 text-text-muted border-white/10"
            )}>
              {change.trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
              {change.trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
              {change.trend === 'neutral' && <Minus className="h-3 w-3" />}
              {change.value}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        
        {description && (
          <p className="text-xs text-text-muted mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
