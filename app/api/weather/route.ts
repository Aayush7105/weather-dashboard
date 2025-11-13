import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

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
    // console.log("🔍 Full Weather Data:", data);

    if (!res.ok) {
      return NextResponse.json({ error: data.message }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Weather fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 },
    );
  }
}
