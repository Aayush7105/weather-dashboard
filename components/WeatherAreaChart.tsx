"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useSpring } from "motion/react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

interface WeatherAreaChartProps {
  chartData?: { time: string; temp: number }[];
  city?: string;
}

export default function WeatherAreaChart({
  chartData = [
    { time: "00:00", temp: 26 },
    { time: "03:00", temp: 25 },
    { time: "06:00", temp: 24 },
    { time: "09:00", temp: 28 },
    { time: "12:00", temp: 31 },
    { time: "15:00", temp: 30 },
    { time: "18:00", temp: 27 },
    { time: "21:00", temp: 26 },
  ],
  city = "Delhi",
}: WeatherAreaChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [axis, setAxis] = useState(0);
  const [chartWidth, setChartWidth] = useState(0);

  const springX = useSpring(0, { damping: 30, stiffness: 100 });
  const springY = useSpring(0, { damping: 30, stiffness: 100 });

  useMotionValueEvent(springX, "change", (latest) => setAxis(latest));

  useEffect(() => {
    if (chartData.length > 0) {
      springY.set(chartData[chartData.length - 1].temp);
    }

    const syncAxisToChartEnd = () => {
      const width = chartRef.current?.getBoundingClientRect().width ?? 0;
      setChartWidth(width);
      springX.set(width);
    };

    syncAxisToChartEnd();
    window.addEventListener("resize", syncAxisToChartEnd);

    return () => window.removeEventListener("resize", syncAxisToChartEnd);
  }, [chartData, springX, springY]);

  const clipRight = Math.max(0, chartWidth - axis);

  const chartConfig = {
    temp: {
      label: "Temperature (deg C)",
      color: "#38bdf8",
    },
  } satisfies ChartConfig;

  return (
    <Card className="rounded-lg border border-white/10 bg-white/[0.045] shadow-lg shadow-black/10 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg text-white">
          {springY.get().toFixed(0)}&deg;C
          <Badge
            variant="secondary"
            className="ml-2 gap-1 bg-emerald-300/10 text-emerald-200 hover:bg-emerald-300/10"
          >
            <TrendingUp className="h-4 w-4" />
            <span>+3.8%</span>
          </Badge>
        </CardTitle>
        <CardDescription className="text-slate-400">
          Temperature forecast for {city}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          ref={chartRef}
          className="h-60 w-full"
          config={chartConfig}
        >
          <AreaChart
            className="overflow-visible"
            accessibilityLayer
            data={chartData}
            onMouseMove={(state) => {
              const x = state.activeCoordinate?.x;
              const dataValue = state.activePayload?.[0]?.value;

              if (x && dataValue !== undefined) {
                springX.set(x);
                springY.set(Number(dataValue));
              }
            }}
            onMouseLeave={() => {
              const width =
                chartRef.current?.getBoundingClientRect().width ?? 0;
              setChartWidth(width);
              springX.set(width);

              const lastIndex = (chartData?.length ?? 0) - 1;
              const lastTemp =
                lastIndex >= 0 && chartData?.[lastIndex]?.temp != null
                  ? chartData[lastIndex].temp
                  : 0;

              springY.jump(lastTemp);
            }}
            margin={{ right: 0, left: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              horizontalCoordinatesGenerator={(props) => {
                const { height } = props;
                return [0, height - 30];
              }}
              stroke="rgba(255,255,255,0.11)"
            />

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
              tick={{ fill: "#94a3b8" }}
            />

            <Area
              dataKey="temp"
              type="monotone"
              fill="url(#gradient-clipped-area-temp)"
              fillOpacity={0.35}
              stroke="#38bdf8"
              strokeWidth={2}
              clipPath={`inset(0 ${clipRight} 0 0)`}
            />

            <line
              x1={axis}
              y1={0}
              x2={axis}
              y2="85%"
              stroke="#38bdf8"
              strokeDasharray="3 3"
              strokeLinecap="round"
              strokeOpacity={0.4}
            />

            <rect
              x={axis - 50}
              y={0}
              width={50}
              height={18}
              fill="#38bdf8"
              rx={4}
            />
            <text
              x={axis - 25}
              fontWeight={600}
              y={13}
              textAnchor="middle"
              fill="#0f172a"
            >
              {springY.get().toFixed(0)}&deg;C
            </text>

            <Area
              dataKey="temp"
              type="monotone"
              fill="none"
              stroke="#38bdf8"
              strokeOpacity={0.15}
            />

            <defs>
              <linearGradient
                id="gradient-clipped-area-temp"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
