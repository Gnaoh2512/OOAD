"use client";

import React, { useState, useRef } from "react";
import styles from "./Calendar.module.scss";
import SidePanel from "./SidePanel";
import throttle from "lodash/throttle";
import { useAuth } from "../providers/authProvider";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Calendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);

  const { logout } = useAuth();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const throttledSetDate = useRef(
    throttle((day: number) => {
      setSelectedDate(new Date(year, month, day));
      setShowSidePanel(true);
    }, 1000)
  ).current;

  const handleDayClick = (day: number) => {
    throttledSetDate(day);
  };

  const calendarCells: (number | null)[] = Array(firstDay)
    .fill(null)
    .concat([...Array(daysInMonth).keys()].map((i) => i + 1));

  return (
    <div className={`${styles.container} ${showSidePanel ? styles.expand : ""}`}>
      <button className={styles.logoutBtn} onClick={logout}>
        Log out
      </button>
      <div className={styles.calendar}>
        <div className={styles.header}>
          <button onClick={prevMonth}>&larr;</button>
          <h2>
            {currentDate.toLocaleString("en-US", { month: "long" })} {year}
          </h2>
          <button onClick={nextMonth}>&rarr;</button>
        </div>

        <div className={styles.grid}>
          {daysOfWeek.map((day) => (
            <div key={day} className={styles.dayName}>
              {day}
            </div>
          ))}

          {calendarCells.map((day, i) => {
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

            const dateValue = day ? new Date(year, month, day).toISOString().split("T")[0] : "";
            const isEmpty = day === null;

            return (
              <div key={i} className={`${styles.dayCell} ${isToday ? styles.today : ""} ${isEmpty ? styles.hide : ""}`} data-date={dateValue} onClick={() => day && handleDayClick(day)}>
                {day ?? ""}
              </div>
            );
          })}
        </div>
      </div>
      <SidePanel selectedDate={selectedDate} showSidePanel={showSidePanel} setShowSidePanel={setShowSidePanel} />
    </div>
  );
}

export default Calendar;
