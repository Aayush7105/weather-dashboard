"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function WeatherAreaChart() {
  return (
    <Card className="rounded-xl border border-white/30 bg-neutral-700 shadow-lg backdrop-blur-xl">
      {/* <CardHeader>
        <CardTitle className="text-lg">Temperature Trend</CardTitle>
        <CardDescription>Last 6 time intervals</CardDescription>
      </CardHeader> */}

      {/* <CardContent> */}
      <ChartContainer config={chartConfig} className="h-auto">
        <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
            tick={{ fill: "#ff0000" }}
          />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Area
            dataKey="desktop"
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.35}
            stroke="var(--color-desktop)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
      {/* </CardContent> */}
    </Card>
  );
}
