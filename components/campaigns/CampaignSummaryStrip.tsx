import { MetricCard } from "@/components/dashboard/MetricCard";
import { Send, Radio, MessageSquare, Calendar } from "lucide-react";

export function CampaignSummaryStrip() {
  // In a real app, these would be passed as props or fetched via a hook
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <MetricCard
        title="Outbound Sent Today"
        value="1,240"
        change={{ value: "+12%", trend: "up" }}
        icon={<Send className="h-4 w-4" />}
      />
      <MetricCard
        title="Active Campaigns"
        value="3"
        icon={<Radio className="h-4 w-4 text-success-500 animate-pulse" />}
      />
      <MetricCard
        title="Response Rate"
        value="4.2%"
        change={{ value: "+0.8%", trend: "up" }}
        icon={<MessageSquare className="h-4 w-4" />}
      />
      <MetricCard
        title="Bookings (30d)"
        value="18"
        change={{ value: "+2", trend: "up" }}
        icon={<Calendar className="h-4 w-4" />}
      />
    </div>
  );
}
