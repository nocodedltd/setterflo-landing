import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MessageSquare, Calendar, MapPin, Tag, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  name: string;
  handle: string;
  status: 'active' | 'pending' | 'qualified' | 'booked';
  location: string;
  role: string;
  lastMessage: string;
  lastMessageTime: string;
  score: number;
}

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  return (
    <Card className="glass-card group cursor-grab active:cursor-grabbing border-white/[0.04]">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 shadow-inner" />
              <div className={cn(
                "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0E1B36]",
                lead.score > 80 ? "bg-success-500" : lead.score > 50 ? "bg-warning-500" : "bg-text-muted"
              )} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{lead.handle}</span>
              </div>
              <p className="text-xs text-text-muted font-medium">{lead.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-text-muted hover:text-white -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
           <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.03] text-text-secondary border border-white/[0.05]">
             <MapPin className="h-3 w-3 mr-1 opacity-70" /> {lead.location}
           </span>
           <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.03] text-text-secondary border border-white/[0.05]">
             <Tag className="h-3 w-3 mr-1 opacity-70" /> {lead.role}
           </span>
        </div>

        {/* Last Message Preview */}
        <div className="relative group/msg">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/10 rounded-full group-hover/msg:bg-primary/50 transition-colors" />
          <div className="pl-2.5 py-0.5">
            <p className="text-xs text-text-secondary line-clamp-2 italic leading-relaxed">"{lead.lastMessage}"</p>
            <p className="text-[10px] text-text-muted mt-1">{lead.lastMessageTime}</p>
          </div>
        </div>

        {/* Quick Actions (Slide up on hover) */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
           <div className="flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
             <Button variant="ghost" size="icon" className="h-7 w-7 text-text-muted hover:text-primary-400 hover:bg-primary/10 rounded-md">
                <MessageSquare className="h-3.5 w-3.5" />
             </Button>
             <Button variant="ghost" size="icon" className="h-7 w-7 text-text-muted hover:text-success-400 hover:bg-success/10 rounded-md">
                <Calendar className="h-3.5 w-3.5" />
             </Button>
           </div>
           <div className="text-[10px] font-medium text-text-muted">
             Score: <span className={cn(
               lead.score > 80 ? "text-success-400" : "text-text-secondary"
             )}>{lead.score}</span>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
