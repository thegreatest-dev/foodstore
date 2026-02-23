"use client";
import React, { useEffect, useState } from "react";

interface StatCounterProps {
  value: number;
  label: string;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
}

const StatCounter: React.FC<StatCounterProps> = ({ value, label, duration = 1200, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    let raf: number;
    function animate() {
      start += increment;
      if (start < value) {
        setCount(Math.floor(start));
        raf = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <div className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-center">
      <p className="text-xl font-bold text-white">{prefix}{count}{suffix}</p>
      <p className="text-xs sm:text-sm text-white/80">{label}</p>
    </div>
  );
};

export default StatCounter;
