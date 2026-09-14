"use client";

import { useState } from "react";
import AhasaTVLoader from "@/components/ahasa-tv-loader";

export default function HomeLoader() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return <AhasaTVLoader onComplete={() => setShow(false)} />;
}
