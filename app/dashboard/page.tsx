import { MetricCard } from "@/components/dashboard/MetricCard";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { SourceChart } from "@/components/dashboard/SourceChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { Phone, MessageSquare, Zap, Target, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-text-secondary max-w-lg">
            Welcome back, Charlie. Here&apos;s what&apos;s happening with your SetterFlo agents today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/[0.03] p-1 rounded-lg border border-white/[0.06]">
            <button className="px-4 py-1.5 rounded-md bg-primary/10 text-primary-400 text-sm font-medium border border-primary/20 shadow-sm transition-all hover:bg-primary/20">
              Overview
            </button>
            <button className="px-4 py-1.5 rounded-md text-text-muted text-sm font-medium hover:text-white transition-colors">
              Performance
            </button>
          </div>
          <Button variant="outline" className="gap-2 hidden sm:flex border-white/[0.1] text-text-secondary hover:text-white bg-transparent hover:bg-white/5 h-10">
            <Calendar className="h-4 w-4" />
            Last 7 Days
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Calls Booked"
          value="24"
          change={{ value: "+15%", trend: "up" }}
          icon={<Phone className="h-5 w-5" />}
        />
        <MetricCard
          title="Active Conversations"
          value="47"
          change={{ value: "+8 today", trend: "up" }}
          icon={<MessageSquare className="h-5 w-5" />}
        />
        <MetricCard
          title="Response Rate"
          value="98%"
          change={{ value: "+2%", trend: "up" }}
          icon={<Zap className="h-5 w-5" />}
        />
        <MetricCard
          title="Conversion Rate"
          value="32%"
          change={{ value: "+5%", trend: "up" }}
          icon={<Target className="h-5 w-5" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OverviewChart />
        </div>
        <div className="lg:col-span-1">
          <SourceChart />
        </div>
      </div>

      {/* Activity & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div className="lg:col-span-1">
          <InsightsPanel />
        </div>
      </div>
    </div>
  );
}
