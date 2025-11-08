import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("❌ AQI API Error:", err);
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("⚠️ Error fetching AQI:", error);
    return NextResponse.json({ error: "Failed to fetch AQI" }, { status: 500 });
  }
}
