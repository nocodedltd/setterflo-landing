import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MessageSquare, Calendar, CheckCircle, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const activities = [
  {
    id: 1,
    type: 'booking',
    content: 'Call booked with',
    target: '@alex_johnson',
    time: '2m ago',
    icon: Calendar,
    color: 'text-primary-400',
    bg: 'bg-primary/10 border-primary/20'
  },
  {
    id: 2,
    type: 'message',
    content: 'New conversation started with',
    target: '@sarah_coach',
    time: '5m ago',
    icon: MessageSquare,
    color: 'text-accent-purple-400',
    bg: 'bg-accent-purple-500/10 border-accent-purple-500/20'
  },
  {
    id: 3,
    type: 'qualification',
    content: 'Lead qualified:',
    target: '@mark_business',
    time: '12m ago',
    icon: CheckCircle,
    color: 'text-success-500',
    bg: 'bg-success-500/10 border-success-500/20'
  },
  {
    id: 4,
    type: 'campaign',
    content: 'Campaign sent 25 DMs:',
    target: '"Health Coaches"',
    time: '1h ago',
    icon: Send,
    color: 'text-text-secondary',
    bg: 'bg-white/5 border-white/10'
  },
];

export function ActivityFeed() {
  return (
    <Card className="glass-panel col-span-1 md:col-span-2 border-white/[0.08]">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.06] pb-4">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" className="text-text-secondary hover:text-white h-8 text-xs gap-1 group">
          View All <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/[0.06]">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors group">
              <div className={`p-2.5 rounded-xl border ${activity.bg} ${activity.color} shadow-sm group-hover:scale-105 transition-transform`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-secondary truncate">
                  {activity.content} <span className="font-semibold text-white">{activity.target}</span>
                </p>
                <p className="text-xs text-text-muted mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
