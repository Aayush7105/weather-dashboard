"use client";
import WeatherAreaChart from "@/components/WeatherAreaChart";
import { useState } from "react";
import { Search, Droplets, Eye } from "lucide-react";
import { FiSunrise, FiSunset } from "react-icons/fi";
export default function WeatherDashboard() {
  // timezone is seconds offset from UTC from OpenWeather (e.g. 19800 for +05:30)
  function formatTime_LocalToCity(
    unixSeconds: number,
    timezoneOffsetSeconds: number,
  ) {
    // create a Date that already represents the city's local wall-clock time in UTC
    const shifted = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);

    // Format it as UTC so the browser does not convert it to the user's timezone
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC", // IMPORTANT: format the already-shifted time as UTC
    }).format(shifted);
  }

  async function fetchWeather(city: string) {
    const res = await fetch(`/api/weather?city=${city}`);
    if (!res.ok) throw new Error("Failed to fetch weather data");
    const data = await res.json();

    return data;
  }

  const [city, setCity] = useState("Delhi");
  interface WeatherData {
    timezone: number;
    main: {
      humidity: number;
      temp: number;
    };
    weather: Array<{
      description: string;
    }>;
    sys: {
      sunrise: number;
      sunset: number;
    };
    coord: { lat: number; lon: number }; // ✅ Add this line
    aqi?: number | null; // ✅ Optional AQI field
  }

  const [weather, setWeather] = useState<WeatherData | null>(null);

  async function handleSearch() {
    try {
      const data = await fetchWeather(city);
      setWeather(data);

      console.log("Fetched Weather Data:", data);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="flex max-h-screen items-center justify-center">
      <div className="m-4 min-h-screen w-[92%] scale-[0.80] rounded-[30px] bg-neutral-950">
        <div className="max-w-10xl mx-auto p-10">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-sans text-4xl font-bold text-neutral-100">
              Weather-Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={city}
                  placeholder="Enter city name.."
                  onChange={(e) => setCity(e.target.value)}
                  className="rounded-lg border-2 border-primary/20 bg-neutral-900 py-2 pl-4 pr-10 text-foreground placeholder-gray-400 focus:border-primary focus:outline-none"
                />
                <Search
                  onClick={handleSearch}
                  className="absolute right-3 top-2.5 h-5 w-5 text-primary/60"
                />
              </div>
              <button className="rounded-lg p-2 transition hover:bg-neutral-900/50">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                </svg>
              </button>
            </div>
          </div>
          {/* Main Weather Card */}
          <div className="mb-8 rounded-3xl border-2 border-primary/10 bg-neutral-900 p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <div className="mb-2 text-7xl font-bold text-neutral-100">
                  {weather ? Math.round(weather.main.temp) : "N/A"}°
                </div>
                <p className="tex text-lg text-foreground/70 text-neutral-100">
                  {city},{" "}
                  {weather
                    ? weather.weather[0].description
                    : "No data available"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-foreground">
                  7:50 pm
                </p>
                <p className="text-sm text-foreground/70">
                  Sunset Time, Monday
                </p>
              </div>
            </div>
          </div>
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border-2 border-primary/10 bg-neutral-900 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-sm text-foreground/60">Humidity</p>
                  <p className="text-3xl font-bold text-primary">
                    {weather?.main.humidity ?? "N/A"}%
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-primary/10 bg-neutral-900 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-sm text-foreground/60">Sunset</p>
                  <p className="text-3xl font-bold text-primary">
                    {" "}
                    {weather
                      ? formatTime_LocalToCity(
                          weather.sys.sunset,
                          weather.timezone,
                        )
                      : "N/A"}
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <FiSunset className="h-7 w-7 text-primary" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-primary/10 bg-neutral-900 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-sm text-foreground/60">UV Index</p>
                  <p
                    className={`text-3xl font-bold ${
                      weather?.aqi === 1
                        ? "text-green-400"
                        : weather?.aqi === 2
                          ? "text-lime-400"
                          : weather?.aqi === 3
                            ? "text-yellow-400"
                            : weather?.aqi === 4
                              ? "text-orange-500"
                              : "text-red-500"
                    }`}
                  >
                    10
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-primary/10 bg-neutral-900 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-sm text-foreground/60">Sunrise</p>
                  <p className="text-3xl font-bold text-primary">
                    {weather
                      ? formatTime_LocalToCity(
                          weather.sys.sunrise,
                          weather.timezone,
                        )
                      : "N/A"}
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <FiSunrise className="h-7 w-7 text-primary" />
                </div>
              </div>
            </div>
          </div>
          {/* Charts and Forecast Row */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Temperature Chart */}
            <div className="flex items-center justify-center rounded-2xl border-2 border-primary/10 bg-neutral-900 px-8 pb-8">
              {/* Chart Container Div */}
              <div className="mt-8 w-full">
                <WeatherAreaChart />
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div className="rounded-2xl border-2 border-primary/10 bg-neutral-900 p-6">
              <h3 className="mb-6 px-4 text-2xl font-semibold text-foreground">
                7-Day Forecast
              </h3>

              <div className="my-10 grid grid-cols-7 grid-rows-1 gap-3">
                {[
                  { day: "MON", temp: 13, icon: "☀️" },
                  { day: "TUE", temp: 12, icon: "⛅" },
                  { day: "WED", temp: 12, icon: "☁️" },
                  { day: "THU", temp: 9, icon: "🌧️" },
                  { day: "FRI", temp: 7, icon: "🌧️" },
                  { day: "SAT", temp: 10, icon: "☁️" },
                  { day: "SUN", temp: 11, icon: "☀️" },
                ].map((day, idx) => (
                  <div key={idx} className="text-center">
                    <p className="mb-3 text-xs font-semibold text-blue-300 text-foreground/70">
                      {day.day}
                    </p>
                    <div className="mb-2 text-2xl">{day.icon}</div>
                    <p className="text-sm font-bold text-blue-300 text-primary">
                      {day.temp}°
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-11 rounded-2xl border-2 border-primary/10 bg-neutral-800 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-semibold text-white/80">
                      Monthly Rainfall
                    </p>
                    <p className="text-4xl font-bold">45mm</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/80">This Year</p>
                    <p className="text-3xl font-bold text-green-300">+17%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
