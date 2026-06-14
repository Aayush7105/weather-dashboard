"use client";

import WeatherAreaChart from "@/components/WeatherAreaChart";
import Time from "@/components/time";
import {
  ArrowLeft,
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Eye,
  MapPin,
  Search,
  Sun,
  Sunrise,
  Sunset,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface WeatherData {
  timezone?: number;
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

const forecastDays: Array<{
  day: string;
  temp: number;
  label: string;
  Icon: LucideIcon;
  tone: string;
}> = [
  {
    day: "MON",
    temp: 13,
    label: "Sunny",
    Icon: Sun,
    tone: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  },
  {
    day: "TUE",
    temp: 12,
    label: "Partly sunny",
    Icon: CloudSun,
    tone: "border-sky-300/25 bg-sky-300/10 text-sky-200",
  },
  {
    day: "WED",
    temp: 12,
    label: "Cloudy",
    Icon: Cloud,
    tone: "border-slate-300/25 bg-slate-300/10 text-slate-200",
  },
  {
    day: "THU",
    temp: 9,
    label: "Rain",
    Icon: CloudRain,
    tone: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
  },
  {
    day: "FRI",
    temp: 7,
    label: "Rain",
    Icon: CloudRain,
    tone: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
  },
  {
    day: "SAT",
    temp: 10,
    label: "Cloudy",
    Icon: Cloud,
    tone: "border-slate-300/25 bg-slate-300/10 text-slate-200",
  },
  {
    day: "SUN",
    temp: 11,
    label: "Sunny",
    Icon: Sun,
    tone: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  },
];

export default function WeatherDashboard() {
  const [city, setCity] = useState("Delhi");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aqi, setAqi] = useState<number | null>(null);
  const [forecastData, setForecastData] = useState<
    { time: string; temp: number }[]
  >([]);
  const [invalidCity, setInvalidCity] = useState(false);

  async function fetchWeather(cityName: string) {
    try {
      const res = await fetch(
        `/api/weather?city=${encodeURIComponent(cityName)}`,
      );
      return await res.json();
    } catch (err) {
      console.error("Weather API error:", err);
      return { cod: "500", message: "network error" };
    }
  }

  async function fetchAQI(lat: number, lon: number) {
    try {
      const res = await fetch(`/api/airquality?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      return data.list?.[0]?.main?.aqi ?? null;
    } catch (err) {
      console.error("AQI fetch error:", err);
      return null;
    }
  }

  async function fetchForecast(cityName: string) {
    try {
      const res = await fetch(
        `/api/forecast?city=${encodeURIComponent(cityName)}`,
      );
      const data = await res.json();
      return data.hourlyData || [];
    } catch (err) {
      console.error("Forecast fetch error:", err);
      return [];
    }
  }

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

  async function handleSearch() {
    const trimmedCity = city.trim();

    if (!trimmedCity) {
      return;
    }

    const data = await fetchWeather(trimmedCity);

    if (data.cod === "404" || data.message === "city not found") {
      setInvalidCity(true);
      setWeather(null);
      setAqi(null);
      setForecastData([]);
      return;
    }

    if (!data.main) {
      setInvalidCity(true);
      setWeather(null);
      return;
    }

    setInvalidCity(false);
    setCity(trimmedCity);
    setWeather(data);

    if (data.coord) {
      const fetchedAQI = await fetchAQI(data.coord.lat, data.coord.lon);
      setAqi(fetchedAQI);
    }

    const forecast = await fetchForecast(trimmedCity);
    setForecastData(forecast);
  }

  const getAqiColor = (aqi: number | null) => {
    if (aqi === null) return "text-slate-400";
    if (aqi === 1) return "text-emerald-300";
    if (aqi === 2) return "text-lime-300";
    if (aqi === 3) return "text-amber-300";
    if (aqi === 4) return "text-orange-300";
    if (aqi === 5) return "text-rose-300";

    return "text-slate-400";
  };

  const timezone = weather?.timezone ?? 0;
  const humidityValue =
    weather?.main?.humidity !== undefined ? `${weather.main.humidity}%` : "N/A";
  const sunriseValue = weather?.sys?.sunrise
    ? formatTime_LocalToCity(weather.sys.sunrise, timezone)
    : "N/A";
  const sunsetValue = weather?.sys?.sunset
    ? formatTime_LocalToCity(weather.sys.sunset, timezone)
    : "N/A";
  const description =
    weather?.weather?.[0]?.description ?? "Search for a city to load live data";

  const metricCards: Array<{
    label: string;
    value: string | number;
    Icon: LucideIcon;
    accent: string;
    valueClassName?: string;
  }> = [
    {
      label: "Humidity",
      value: humidityValue,
      Icon: Droplets,
      accent: "border-sky-300/20 bg-sky-300/10 text-sky-200",
    },
    {
      label: "Sunrise",
      value: sunriseValue,
      Icon: Sunrise,
      accent: "border-amber-300/20 bg-amber-300/10 text-amber-200",
    },
    {
      label: "Air Quality",
      value: aqi !== null ? aqi : "N/A",
      Icon: Eye,
      accent: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
      valueClassName: getAqiColor(aqi),
    },
    {
      label: "Sunset",
      value: sunsetValue,
      Icon: Sunset,
      accent: "border-orange-300/20 bg-orange-300/10 text-orange-200",
    },
  ];

  if (invalidCity) {
    return (
      <div className="weather-shell flex min-h-screen items-center justify-center px-4 py-6 text-slate-100">
        <div className="w-full max-w-lg rounded-lg border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl shadow-black/30 backdrop-blur">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-lg border border-amber-300/25 bg-amber-300/10 text-amber-200">
            <MapPin className="h-7 w-7" />
          </div>
          <h1 className="mb-3 text-3xl font-semibold text-white">
            Unknown Location
          </h1>
          <p className="mb-6 text-sm leading-6 text-slate-300">
            We could not find the city you searched for. Try another spelling or
            choose a nearby city.
          </p>

          <button
            onClick={() => {
              setInvalidCity(false);
              setCity("Delhi");
            }}
            className="inline-flex items-center gap-2 rounded-md bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="weather-shell min-h-screen px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg border border-amber-300/25 bg-amber-300/10 text-amber-200">
                <CloudSun className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                  Weather Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Live conditions, air quality, and hourly trends
                </p>
              </div>
            </div>
          </div>

          <form
            className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-black/25 p-1.5 shadow-lg shadow-black/20 backdrop-blur md:w-[360px]"
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch();
            }}
          >
            <input
              type="text"
              value={city}
              placeholder="Enter city name"
              onChange={(e) => setCity(e.target.value)}
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="grid h-10 w-10 flex-none place-items-center rounded-md bg-sky-300 text-slate-950 transition hover:bg-sky-200"
              aria-label="Search weather"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-md border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-medium uppercase tracking-normal text-sky-200">
                  <MapPin className="h-3.5 w-3.5" />
                  Current Conditions
                </p>
                <div className="mt-5 flex items-start gap-2">
                  <span className="text-7xl font-semibold leading-none text-white sm:text-8xl">
                    {weather?.main?.temp !== undefined
                      ? Math.round(weather.main.temp)
                      : "N/A"}
                  </span>
                  {weather?.main?.temp !== undefined && (
                    <span className="pt-2 text-2xl font-semibold text-amber-200 sm:text-3xl">
                      &deg;C
                    </span>
                  )}
                </div>
                <p className="mt-4 max-w-xl text-base capitalize leading-7 text-slate-300">
                  {city}, {description}
                </p>
              </div>
              <Time />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {metricCards.map(({ label, value, Icon, accent, valueClassName }) => (
              <div
                key={label}
                className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-lg shadow-black/10 backdrop-blur"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 text-sm text-slate-400">{label}</p>
                    <p
                      className={`text-2xl font-semibold sm:text-3xl ${
                        valueClassName ?? "text-white"
                      }`}
                    >
                      {value}
                    </p>
                  </div>
                  <div
                    className={`grid h-11 w-11 flex-none place-items-center rounded-lg border ${accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <WeatherAreaChart city={city} chartData={forecastData} />

          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-lg shadow-black/10 backdrop-blur sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  7-Day Forecast
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  A quick look at the week ahead
                </p>
              </div>
              <CloudSun className="h-6 w-6 text-amber-200" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
              {forecastDays.map(({ day, temp, label, Icon, tone }) => (
                <div
                  key={day}
                  className="rounded-lg border border-white/10 bg-black/20 p-3 text-center"
                >
                  <p className="text-xs font-semibold text-slate-400">{day}</p>
                  <div
                    className={`mx-auto my-3 grid h-10 w-10 place-items-center rounded-md border ${tone}`}
                    title={label}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {temp}&deg;C
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="mb-1 text-sm font-medium text-slate-300">
                    Monthly Rainfall
                  </p>
                  <p className="text-3xl font-semibold text-white">45mm</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">This Year</p>
                  <p className="text-2xl font-semibold text-emerald-300">
                    +17%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
