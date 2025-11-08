"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function TemperatureChart({
  data,
}: {
  data: { time: string; temp: number }[];
}) {
  return (
    <ChartContainer
      config={{
        temp: {
          label: "Temperature (°C)",
          color: "hsl(220, 90%, 60%)",
        },
      }}
      className="rounded-xl bg-card p-4"
    >
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis
          dataKey="time"
          tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
        />
        <YAxis tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="temp"
          stroke="var(--color-temp)"
          fill="var(--color-temp)"
          fillOpacity={0.2}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
