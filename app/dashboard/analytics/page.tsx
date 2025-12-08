"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/Button";
import { ChartShell } from "@/components/ui/ChartShell";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  ArrowUpRight,
  Filter,
  Info
} from "lucide-react";

const funnelData = [
  { name: 'New Leads', value: 450, fill: '#3b82f6' },
  { name: 'Responded', value: 315, fill: '#8b5cf6' },
  { name: 'Qualified', value: 135, fill: '#ec4899' },
  { name: 'Booked', value: 45, fill: '#10b981' },
  { name: 'Closed', value: 12, fill: '#f59e0b' },
];

const sourceData = [
  { name: 'Inbound (IG)', value: 65, color: '#00B9AD' },
  { name: 'Outbound', value: 35, color: '#8b5cf6' },
];

const performanceData = [
  { name: "Mon", value: 4 },
  { name: "Tue", value: 6 },
  { name: "Wed", value: 8 },
  { name: "Thu", value: 12 },
  { name: "Fri", value: 15 },
  { name: "Sat", value: 10 },
  { name: "Sun", value: 18 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary-400" />
            Analytics & Reports
          </h1>
          <p className="text-text-secondary max-w-lg">
            Track your funnel performance and revenue impact.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-white/[0.1] text-text-secondary hover:text-white bg-transparent hover:bg-white/5 gap-2 h-10">
             <Filter className="h-4 w-4" />
             Filters
           </Button>
           <div className="flex items-center bg-white/[0.03] p-1 rounded-lg border border-white/[0.06]">
             <button className="px-4 py-1.5 rounded-md bg-primary/10 text-primary-400 text-sm font-medium border border-primary/20 shadow-sm transition-all">
               Last 30 Days
             </button>
             <button className="px-4 py-1.5 rounded-md text-text-muted text-sm font-medium hover:text-white transition-colors">
               Last 90 Days
             </button>
           </div>
           <Button className="bg-primary hover:bg-primary-600 text-white gap-2 shadow-lg shadow-primary/20 h-10">
             <Download className="h-4 w-4" />
             Export
           </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Avg Response Time"
          value="12m"
          change={{ value: "-15%", trend: "up" }} // trend up is good for speed reduction visually, but logically down
          description="vs 14m last month"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Booking Rate"
          value="10.4%"
          change={{ value: "+2.1%", trend: "up" }}
          description="From qualified leads"
          icon={<Calendar className="h-5 w-5" />}
        />
        <MetricCard
          title="Pipeline Value"
          value="$24,000"
          change={{ value: "+$4k", trend: "up" }}
          description="Based on 8 bookings"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          title="ROI"
          value="14.1x"
          change={{ value: "+1.2x", trend: "up" }}
          description="Return on SetterFlo"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Funnel Chart */}
        <div className="lg:col-span-2">
          <ChartShell 
            title="Conversion Funnel" 
            description="Lead progression from initial contact to closed deal"
            actions={
              <div className="flex items-center gap-2 text-xs text-text-muted bg-white/5 px-2 py-1 rounded border border-white/5">
                <Info className="h-3 w-3" />
                <span>Biggest drop-off: Qualified → Booked</span>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  stroke="#94A3B8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  fontWeight={500}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.03)'}}
                  contentStyle={{ 
                    backgroundColor: "rgba(11, 20, 38, 0.9)", 
                    border: "1px solid rgba(255, 255, 255, 0.1)", 
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                    backdropFilter: "blur(8px)"
                  }}
                  itemStyle={{ color: "#fff", fontWeight: 500 }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} background={{ fill: 'rgba(255,255,255,0.02)' }}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.9} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartShell>
        </div>

        {/* Source Breakdown */}
        <div className="lg:col-span-1">
          <ChartShell 
            title="Lead Sources" 
            description="Where your bookings come from"
            height="h-[350px]"
          >
             <div className="h-[220px] flex items-center justify-center relative">
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-white">100</span>
                <span className="text-xs text-text-muted uppercase tracking-wider font-medium">Total Leads</span>
              </div>
              
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(11, 20, 38, 0.9)", 
                      border: "1px solid rgba(255, 255, 255, 0.1)", 
                      borderRadius: "12px",
                      backdropFilter: "blur(8px)"
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
             </div>
             <div className="flex flex-col gap-3 mt-4">
                {sourceData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: entry.color, color: entry.color }} />
                      <span className="text-sm font-medium text-text-secondary">{entry.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{entry.value}%</span>
                  </div>
                ))}
             </div>
          </ChartShell>
        </div>
      </div>

      {/* Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-3">
            <ChartShell
              title="Performance Trends"
              description="Booking volume over the last 7 days"
              height="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00B9AD" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00B9AD" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(11, 20, 38, 0.9)", 
                      border: "1px solid rgba(255, 255, 255, 0.1)", 
                      borderRadius: "12px",
                      backdropFilter: "blur(8px)"
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00B9AD" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartShell>
         </div>
      </div>
    </div>
  );
}
