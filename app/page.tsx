import { Search, Droplets, Sun, Eye } from "lucide-react";

export default function WeatherDashboard() {
  return (
    <div className="0 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary text-purple-400">
            Rayn
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter city name.."
                className="rounded-lg border-2 border-primary/20 bg-white py-2 pl-4 pr-10 text-foreground placeholder-gray-400 focus:border-primary focus:outline-none"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-primary/60" />
            </div>
            <button className="rounded-lg p-2 transition hover:bg-white/50">
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
        <div className="mb-8 rounded-3xl border-2 border-primary/30 bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="mb-2 text-7xl font-bold text-primary text-purple-400">
                13°
              </div>
              <p className="text-lg text-foreground/70 text-purple-400">
                Telluride, CO, USA
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-foreground">7:50 pm</p>
              <p className="text-sm text-foreground/70">Sunset Time, Monday</p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border-2 border-primary/10 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-sm text-foreground/60">Humidity</p>
                <p className="text-3xl font-bold text-primary">39%</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-primary/10 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-sm text-foreground/60">Sunset</p>
                <p className="text-3xl font-bold text-primary">7:50 pm</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <Sun className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-primary/10 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-sm text-foreground/60">UV Index</p>
                <p className="text-3xl font-bold text-primary">0 of 10</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <Eye className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-primary/10 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-sm text-foreground/60">Sunrise</p>
                <p className="text-3xl font-bold text-primary">6:35 pm</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <Sun className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Forecast Row */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Temperature Chart */}
          <div className="rounded-2xl border-2 border-primary/10 bg-white p-6">
            {/* line chart */}
          </div>

          {/* 7-Day Forecast */}
          <div className="rounded-2xl border-2 border-primary/10 bg-white p-6">
            <h3 className="mb-6 font-semibold text-foreground">
              7-Day Forecast
            </h3>

            <div className="grid grid-cols-7 gap-3">
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
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-neutral-900 p-6 text-white">
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
  );
}
