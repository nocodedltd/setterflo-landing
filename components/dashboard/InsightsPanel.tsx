import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Clock, TrendingUp, Users, Sparkles } from "lucide-react";

const insights = [
  {
    icon: Clock,
    text: "Your best response time today: 8 seconds",
  },
  {
    icon: TrendingUp,
    text: 'Top performing campaign: "Mindset Coaches" (42% conv.)',
  },
  {
    icon: Users,
    text: "12 leads ready for follow-up",
  },
];

export function InsightsPanel() {
  return (
    <Card className="col-span-1 bg-gradient-to-br from-[#0B1426] to-[#050A14] border border-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      
      <CardHeader className="border-b border-white/[0.06] pb-4 relative z-10">
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="h-5 w-5 text-warning-400 fill-warning-400/20" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative z-10">
        <div className="divide-y divide-white/[0.06]">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-4 hover:bg-white/[0.02] transition-colors">
              <div className="mt-0.5 p-1.5 rounded-lg bg-white/5 text-primary-400">
                <insight.icon className="h-4 w-4" />
              </div>
              <p className="text-sm text-text-secondary leading-snug">
                {insight.text.split(':').map((part, i) => (
                  i === 0 ? <span key={i} className="text-text-muted block text-xs mb-0.5 uppercase tracking-wide font-medium">{part}:</span> : <span key={i} className="text-white font-medium">{part}</span>
                ))}
                {!insight.text.includes(':') && <span className="text-white font-medium">{insight.text}</span>}
              </p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/[0.06]">
          <button className="w-full py-2 rounded-lg bg-primary/10 text-primary-400 text-xs font-bold uppercase tracking-wide hover:bg-primary/20 transition-colors border border-primary/20">
            View All Insights
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
