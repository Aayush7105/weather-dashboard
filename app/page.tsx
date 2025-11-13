"use client";
import WeatherAreaChart from "@/components/WeatherAreaChart";
import { useState } from "react";
import { Search, Droplets, Eye } from "lucide-react";
import { FiSunrise, FiSunset } from "react-icons/fi";
import Time from "@/components/time";
import { TiWeatherPartlySunny } from "react-icons/ti";

export default function WeatherDashboard() {
  const [city, setCity] = useState("Delhi");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aqi, setAqi] = useState<number | null>(null);
  const [forecastData, setForecastData] = useState<
    { time: string; temp: number }[]
  >([]);

  interface WeatherData {
    timezone: number;
    main?: {
      humidity: number;
      temp: number;
    };
    weather?: Array<{
      description: string;
    }>;
    sys?: {
      sunrise: number;
      sunset: number;
    };
    coord?: {
      lat: number;
      lon: number;
    };
    cod?: string | number;
    message?: string;
  }

  const [invalidCity, setInvalidCity] = useState(false);

  // -------------------------------
  // FETCH WEATHER
  // -------------------------------
  async function fetchWeather(city: string) {
    try {
      const res = await fetch(`/api/weather?city=${city}`);
      const data = await res.json();
      return data; // always return JSON
    } catch (err) {
      console.error("⚠ Weather API error:", err);
      return { cod: "500", message: "network error" };
    }
  }

  async function fetchAQI(lat: number, lon: number) {
    try {
      const res = await fetch(`/api/airquality?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      return data.list?.[0]?.main?.aqi ?? null;
    } catch (err) {
      console.error("⚠ AQI fetch error:", err);
      return null;
    }
  }

  async function fetchForecast(city: string) {
    try {
      const res = await fetch(`/api/forecast?city=${city}`);
      const data = await res.json();
      return data.hourlyData || [];
    } catch (err) {
      console.error("⚠ Forecast fetch error:", err);
      return [];
    }
  }

  // -------------------------------
  // FORMAT TIME
  // -------------------------------
  function formatTime_LocalToCity(
    unixSeconds: number,
    timezoneOffsetSeconds: number,
  ) {
    const shifted = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);

    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    }).format(shifted);
  }

  // -------------------------------
  // SEARCH
  // -------------------------------
  async function handleSearch() {
    const data = await fetchWeather(city);

    // Invalid City (404)
    if (data.cod === "404" || data.message === "city not found") {
      setInvalidCity(true);
      setWeather(null);
      setAqi(null);
      setForecastData([]);
      return;
    }

    // If weather data structure is broken
    if (!data.main) {
      setInvalidCity(true);
      setWeather(null);
      return;
    }

    // Valid city
    setInvalidCity(false);
    setWeather(data);

    if (data.coord) {
      const fetchedAQI = await fetchAQI(data.coord.lat, data.coord.lon);
      setAqi(fetchedAQI);
    }

    const forecast = await fetchForecast(city);
    setForecastData(forecast);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && city.trim() !== "") {
      handleSearch();
    }
  };

  const getAqiColor = (aqi: number | null) => {
    if (aqi === null) return "text-gray-400";

    if (aqi === 1) return "text-green-400"; // Good
    if (aqi === 2) return "text-yellow-400"; // Fair
    if (aqi === 3) return "text-orange-400"; // Moderate
    if (aqi === 4) return "text-red-400"; // Poor
    if (aqi === 5) return "text-purple-400"; // Very Poor

    return "text-gray-400";
  };

  // -------------------------------
  // FULL PAGE UNKNOWN LOCATION
  // -------------------------------
  if (invalidCity) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950">
        <div className="rounded-3xl border border-primary/20 bg-neutral-900 p-10 text-center">
          <h1 className="mb-4 text-4xl font-bold text-neutral-100">
            Unknown Location
          </h1>
          <p className="mb-6 text-gray-400">
            We couldn&apos;t find the city you searched for. Please try again.
          </p>

          <button
            onClick={() => {
              setInvalidCity(false);
              setCity("Delhi");
            }}
            className="rounded-lg bg-primary px-6 py-2 text-neutral-900 hover:bg-primary/80"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------
  // MAIN DASHBOARD
  // -------------------------------
  return (
    <div className="flex max-h-screen items-center justify-center">
      <div className="m-4 min-h-screen w-[92%] scale-[0.80] rounded-[30px] bg-neutral-950">
        <div className="max-w-10xl mx-auto p-10">
          {/* HEADER */}
          <div className="mb-8 flex items-center justify-between">
            <div className="gap-3">
              <div className="flex justify-center gap-3">
                <TiWeatherPartlySunny className="mt-2 h-8 w-8 text-yellow-400" />
                <h1 className="text-4xl font-bold text-gray-100">
                  Weather Dashboard
                </h1>
              </div>
              <div className="text-md px-11 text-gray-500">
                Updated in real-time
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={city}
                  placeholder="Enter city name.."
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="rounded-lg border-2 border-primary/20 bg-neutral-900 py-2 pl-4 pr-10 text-foreground placeholder-gray-400 focus:border-primary focus:outline-none"
                />
                <Search
                  onClick={handleSearch}
                  className="absolute right-3 top-2.5 h-5 w-5 cursor-pointer text-primary/60"
                />
              </div>
            </div>
          </div>

          {/* MAIN WEATHER CARD */}
          <div className="mb-8 rounded-3xl border-2 border-primary/10 bg-neutral-900 p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <div className="mb-2 text-7xl font-bold text-neutral-100">
                  {weather?.main?.temp !== undefined
                    ? Math.round(weather.main.temp)
                    : "N/A"}
                  °
                </div>
                <p className="text-lg text-neutral-100">
                  {city},{" "}
                  {weather?.weather?.[0]?.description ?? "No data available"}
                </p>
              </div>
              <div className="text-right">
                <Time />
              </div>
            </div>
          </div>

          {/* 4 small boxes */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Humidity */}
            <div className="rounded-2xl border-2 border-primary/10 bg-neutral-900 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-sm text-foreground/60">Humidity</p>
                  <p className="text-3xl font-bold text-primary">
                    {weather?.main?.humidity ?? "N/A"}%
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            {/* Sunset */}
            <div className="rounded-2xl border-2 border-primary/10 bg-neutral-900 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-sm text-foreground/60">Sunset</p>
                  <p className="text-3xl font-bold text-primary">
                    {weather?.sys?.sunrise
                      ? formatTime_LocalToCity(
                          weather.sys.sunrise,
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

            {/* AQI */}
            <div className="rounded-2xl border-2 border-primary/10 bg-neutral-900 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-sm text-foreground/60">
                    Air Quality Index
                  </p>
                  <p className={`text-3xl font-bold ${getAqiColor(aqi)}`}>
                    {aqi !== null ? aqi : "N/A"}
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            {/* Sunrise */}
            <div className="rounded-2xl border-2 border-primary/10 bg-neutral-900 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-sm text-foreground/60">Sunrise</p>
                  <p className="text-3xl font-bold text-primary">
                    {weather?.sys?.sunrise
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

          {/* CHART + 7 DAY FORECAST */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="flex items-center justify-center rounded-2xl border-2 border-primary/10 bg-neutral-900 px-8 pb-8">
              <div className="mt-8 w-full">
                <WeatherAreaChart city={city} chartData={forecastData} />
              </div>
            </div>

            {/* Static 7 Day Forecast */}
            <div className="rounded-2xl border-2 border-primary/10 bg-neutral-900 p-6">
              <h3 className="mb-6 px-4 text-2xl font-semibold text-foreground">
                7-Day Forecast
              </h3>

              <div className="my-10 grid grid-cols-7 gap-3">
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
                    <p className="mb-3 text-xs font-semibold text-foreground/70">
                      {day.day}
                    </p>
                    <div className="mb-2 text-2xl">{day.icon}</div>
                    <p className="text-sm font-bold text-primary">
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
