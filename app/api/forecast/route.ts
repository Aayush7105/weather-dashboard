import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { error: "City parameter is required" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`,
    );
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message }, { status: res.status });
    }

    interface ForecastEntry {
      dt: number;
      main: {
        temp: number;
      };
    }

    // Get next 8 forecast points (~24 hours)
    const hourlyData = data.list.slice(0, 8).map((entry: ForecastEntry) => ({
      time: new Date(entry.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: Math.round(entry.main.temp),
    }));

    return NextResponse.json({ city: data.city.name, hourlyData });
  } catch (err) {
    console.error("Forecast fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch forecast data" },
      { status: 500 },
    );
  }
}
