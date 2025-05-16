"use client";

import React from "react";
import { useAuth } from "./providers/authProvider";
import Calendar from "./components/Calender";

export default function Home() {
  const { user } = useAuth();

  if (!user) return <div>unauthorized</div>;

  return <Calendar />;
}
