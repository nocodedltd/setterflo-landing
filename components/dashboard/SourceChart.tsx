"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const data = [
  { name: "Inbound", value: 65, color: "#00B9AD" },
  { name: "Outbound", value: 35, color: "#8b5cf6" },
];

export function SourceChart() {
  return (
    <Card className="glass-panel col-span-1 border-white/[0.08] h-full">
      <CardHeader className="border-b border-white/[0.06] pb-4">
        <CardTitle>Lead Sources</CardTitle>
        <p className="text-sm text-text-secondary mt-1">Where your bookings come from</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={32}>
               <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                type="category"
                width={80}
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
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6">
           {data.map((item) => (
             <div key={item.name} className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
               <span className="text-sm text-text-secondary">{item.name}</span>
               <span className="text-sm font-bold text-white">{item.value}%</span>
             </div>
           ))}
        </div>
      </CardContent>
    </Card>
  );
}
