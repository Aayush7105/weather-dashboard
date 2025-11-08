"use client";

import { useEffect, useState } from "react";

export default function Time() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );

      setDate(
        now.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );

      setDay(now.toLocaleDateString("en-US", { weekday: "long" }));
    };

    updateTime(); // initial run
    const interval = setInterval(updateTime, 1000); // update every second
    return () => clearInterval(interval); // cleanup when unmounted
  }, []);

  return (
    <div className="text-right text-white">
      <div className="text-3xl font-semibold">{time}</div>
      <div className="text-lg opacity-80">{day}</div>
      <div className="text-sm opacity-70">{date}</div>
    </div>
  );
}
