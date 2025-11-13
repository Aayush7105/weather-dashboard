"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useSpring, useMotionValueEvent } from "motion/react";

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

  const springX = useSpring(0, { damping: 30, stiffness: 100 });
  const springY = useSpring(0, { damping: 30, stiffness: 100 });

  useMotionValueEvent(springX, "change", (latest) => setAxis(latest));

  // Initialize line to end of chart on mount
  useEffect(() => {
    if (chartData.length > 0) {
      springY.set(chartData[chartData.length - 1].temp);
    }
  }, [chartData, springY]);

  const chartConfig = {
    temp: {
      label: "Temperature (°C)",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="rounded-xl border border-white/10 bg-neutral-900 shadow-lg backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-white">
          {springY.get().toFixed(0)}°C
          <Badge
            variant="secondary"
            className="ml-2 bg-green-500/20 text-green-300"
          >
            <TrendingUp className="h-4 w-4" />
            <span>+3.8%</span>
          </Badge>
        </CardTitle>
        <CardDescription className="text-neutral-300">
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
                springY.set(dataValue);
              }
            }}
            onMouseLeave={() => {
              const width =
                chartRef.current?.getBoundingClientRect().width ?? 0;
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
              stroke="rgba(255,255,255,0.1)"
            />

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
              tick={{ fill: "#ff7f7f" }}
            />

            {/* Main animated clipped area */}
            <Area
              dataKey="temp"
              type="monotone"
              fill="url(#gradient-cliped-area-temp)"
              fillOpacity={0.35}
              stroke="#f59e0b"
              strokeWidth={2}
              clipPath={`inset(0 ${
                // eslint-disable-next-line react-hooks/refs
                Number(chartRef.current?.getBoundingClientRect().width) - axis
              } 0 0)`}
            />

            {/* Vertical tracking line */}
            <line
              x1={axis}
              y1={0}
              x2={axis}
              y2={"85%"}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              strokeLinecap="round"
              strokeOpacity={0.4}
            />

            {/* Floating value box */}
            <rect
              x={axis - 50}
              y={0}
              width={50}
              height={18}
              fill="#f59e0b"
              rx={4}
            />
            <text
              x={axis - 25}
              fontWeight={600}
              y={13}
              textAnchor="middle"
              fill="#fff"
            >
              {springY.get().toFixed(0)}°C
            </text>

            {/* Background ghost line */}
            <Area
              dataKey="temp"
              type="monotone"
              fill="none"
              stroke="#f59e0b"
              strokeOpacity={0.15}
            />

            {/* Gradient */}
            <defs>
              <linearGradient
                id="gradient-cliped-area-temp"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
