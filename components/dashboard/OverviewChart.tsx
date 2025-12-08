"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "lucide-react";

const data = [
  { name: "Mon", total: 4 },
  { name: "Tue", total: 6 },
  { name: "Wed", total: 8 },
  { name: "Thu", total: 12 },
  { name: "Fri", total: 15 },
  { name: "Sat", total: 10 },
  { name: "Sun", total: 18 },
];

export function OverviewChart() {
  return (
    <Card className="glass-panel col-span-1 border-white/[0.08]">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.06] pb-4">
        <div>
          <CardTitle>Calls Booked</CardTitle>
          <p className="text-sm text-text-secondary mt-1">Weekly performance overview</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary-400 hover:text-white h-8 text-xs gap-1">
          View Report <ArrowUpRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00B9AD" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00B9AD" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                tickMargin={10}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "rgba(11, 20, 38, 0.9)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)", 
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  backdropFilter: "blur(8px)"
                }}
                itemStyle={{ color: "#fff", fontWeight: 500 }}
                labelStyle={{ color: "#94A3B8", marginBottom: "0.5rem", fontSize: "0.75rem" }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#00B9AD"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTotal)"
                activeDot={{ r: 6, fill: "#fff", stroke: "#00B9AD", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
