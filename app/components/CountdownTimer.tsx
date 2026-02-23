"use client";
import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  initialDays?: number;
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialDays = 28,
  initialHours = 15,
  initialMinutes = 55,
  initialSeconds = 60,
}) => {
  const [time, setTime] = useState({
    days: initialDays,
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  });

  useEffect(() => {
    const totalInitialSeconds =
      initialDays * 86400 + initialHours * 3600 + initialMinutes * 60 + initialSeconds;
    let remaining =
      time.days * 86400 + time.hours * 3600 + time.minutes * 60 + time.seconds;
    const interval = setInterval(() => {
      if (remaining <= 1) {
        setTime({
          days: initialDays,
          hours: initialHours,
          minutes: initialMinutes,
          seconds: initialSeconds,
        });
        remaining = totalInitialSeconds;
      } else {
        remaining -= 1;
        const d = Math.floor(remaining / 86400);
        const h = Math.floor((remaining % 86400) / 3600);
        const m = Math.floor((remaining % 3600) / 60);
        const s = remaining % 60;
        setTime({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDays, initialHours, initialMinutes, initialSeconds]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 mb-8">
      {[
        [pad(time.days), "Days"],
        [pad(time.hours), "Hours"],
        [pad(time.minutes), "Mins"],
        [pad(time.seconds), "Secs"],
      ].map(([val, label]) => (
        <div
          key={label}
          className="rounded-lg border border-white/10 bg-slate-800/80 px-3 py-3 sm:p-4 text-center backdrop-blur-sm flex-1 min-w-[56px] sm:min-w-[72px]"
        >
          <div className="text-xl sm:text-3xl font-bold">{val}</div>
          <div className="text-xs sm:text-sm opacity-90">{label}</div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
