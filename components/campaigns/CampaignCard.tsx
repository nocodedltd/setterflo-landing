import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Play, Pause, MessageSquare, CheckCircle, Phone, ArrowUpRight, Target, AlertTriangle, Edit, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  target: string;
  targetCount: string;
  sent: number;
  total: number;
  responses: number;
  qualified: number;
  booked: number;
  startDate: string;
  // In a real app, these would be derived from settings
  dailyLimit?: number; 
}

interface CampaignCardProps {
  campaign: Campaign;
}

// Simple heuristic for risk level based on daily limit (mock logic)
const getRiskLevel = (limit: number = 20) => {
  if (limit > 50) return { level: 'High', color: 'text-error-500 border-error-500/20 bg-error-500/10', icon: AlertTriangle };
  if (limit > 30) return { level: 'Medium', color: 'text-warning-500 border-warning-500/20 bg-warning-500/10', icon: AlertTriangle };
  return { level: 'Low', color: 'text-success-500 border-success-500/20 bg-success-500/10', icon: CheckCircle };
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = (campaign.sent / campaign.total) * 100;
  const responseRate = Math.round((campaign.responses / campaign.sent) * 100) || 0;
  const risk = getRiskLevel(campaign.dailyLimit || 40); // Default mock limit

  return (
    <Card className="group glass-card border-t-2 overflow-hidden hover:transform hover:scale-[1.01] transition-all duration-300 relative cursor-pointer" 
      style={{ 
        borderTopColor: campaign.status === 'active' ? '#00B9AD' : campaign.status === 'paused' ? '#f59e0b' : '#334155' 
      }}
    >
      <CardHeader className="pb-4 relative">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-primary-200 transition-colors">{campaign.name}</h3>
            </div>
            <p className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
              <span className={cn(
                "h-1.5 w-1.5 rounded-full animate-pulse",
                campaign.status === 'active' ? "bg-primary" : campaign.status === 'paused' ? "bg-warning-500" : "bg-text-muted"
              )} />
              <span className="uppercase tracking-wider opacity-80">{campaign.status}</span>
              <span className="text-white/20 mx-1">|</span>
              <span className="text-text-muted">{campaign.startDate}</span>
            </p>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4 md:static">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-white rounded-full hover:bg-white/10" onClick={(e) => e.stopPropagation()}>
              <Edit className="h-4 w-4" />
            </Button>
            {campaign.status === 'active' ? (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-warning-500 hover:text-warning-400 hover:bg-warning-500/10 rounded-full" onClick={(e) => e.stopPropagation()}>
                <Pause className="h-4 w-4" />
              </Button>
            ) : (
               <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary-400 hover:bg-primary/10 rounded-full" onClick={(e) => e.stopPropagation()}>
                <Play className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-white rounded-full md:hidden" onClick={(e) => e.stopPropagation()}>
               <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Targeting & Risk */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
              <Target className="h-4 w-4 text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase font-bold tracking-wider">Targeting</p>
              <p className="text-sm text-white font-medium">{campaign.targetCount}</p>
            </div>
          </div>
          <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider", risk.color)}>
             <risk.icon className="h-3 w-3" />
             <span>{risk.level} Risk</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-white">Campaign Progress</span>
            <span className="text-primary-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-1000 ease-out relative" 
              style={{ width: `${progress}%` }} 
            >
              {campaign.status === 'active' && (
                 <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
              )}
            </div>
          </div>
          <p className="text-[10px] text-text-muted text-right">{campaign.sent} / {campaign.total} sent</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/[0.06]">
          <div className="text-center space-y-1">
             <div className="flex items-center justify-center gap-1 text-text-muted text-[10px] uppercase font-bold tracking-wider">
                <MessageSquare className="h-3 w-3" /> Resp
             </div>
             <p className="text-xl font-bold text-white">{campaign.responses}</p>
             <p className="text-[10px] text-success-500 flex items-center justify-center">
               <ArrowUpRight className="h-2 w-2 mr-0.5" />{responseRate}%
             </p>
          </div>
          <div className="text-center space-y-1 border-l border-white/[0.06]">
             <div className="flex items-center justify-center gap-1 text-text-muted text-[10px] uppercase font-bold tracking-wider">
                <CheckCircle className="h-3 w-3" /> Qual
             </div>
             <p className="text-xl font-bold text-white">{campaign.qualified}</p>
          </div>
          <div className="text-center space-y-1 border-l border-white/[0.06]">
             <div className="flex items-center justify-center gap-1 text-text-muted text-[10px] uppercase font-bold tracking-wider">
                <Phone className="h-3 w-3" /> Booked
             </div>
             <p className="text-xl font-bold text-white">{campaign.booked}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
