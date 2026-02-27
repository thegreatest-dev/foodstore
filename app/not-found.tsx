"use client";
import { useEffect } from "react";
import ComingSoonPopup from "@/app/components/ComingSoonPopup";

export default function NotFound() {
  useEffect(() => {
    // Optionally, you could add analytics or logging here
  }, []);
  return <ComingSoonPopup />;
}
