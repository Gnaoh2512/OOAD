"use client";

import React, { useEffect, useState } from "react";
import styles from "./SidePanel.module.scss";
import callAPI from "../utils/callAPI";
import { Appointment } from "../types";

type resT = {
  message: string;
  status: string;
  appointmentId: number;
};

const formatDateTime = (date: Date) => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const h = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");

  return `${y}-${m}-${d} ${h}:${min}:00`;
};

type ModalProps = {
  selectedDate?: Date | null;
  showModal: boolean;
  onClose: () => void;
  appointment?: Appointment | null;
};

const handleHourChange = (timeSetter: React.Dispatch<React.SetStateAction<{ hour: string; minute: string }>>, value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 2);
  timeSetter((prev) => ({ ...prev, hour: digits }));
};

const handleHourBlur = (timeSetter: React.Dispatch<React.SetStateAction<{ hour: string; minute: string }>>, hourValue: string) => {
  const num = hourValue ? Math.min(23, Math.max(0, parseInt(hourValue))) : 9;
  timeSetter((prev) => ({ ...prev, hour: num.toString().padStart(2, "0") }));
};

const handleMinuteChange = (timeSetter: React.Dispatch<React.SetStateAction<{ hour: string; minute: string }>>, value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 2);
  timeSetter((prev) => ({ ...prev, minute: digits }));
};

const handleMinuteBlur = (timeSetter: React.Dispatch<React.SetStateAction<{ hour: string; minute: string }>>, minuteValue: string) => {
  const num = minuteValue ? Math.min(59, Math.max(0, parseInt(minuteValue))) : 0;
  timeSetter((prev) => ({ ...prev, minute: num.toString().padStart(2, "0") }));
};

function Modal({ selectedDate, onClose, showModal, appointment = null }: ModalProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState({ hour: "09", minute: "00" });
  const [endTime, setEndTime] = useState({ hour: "17", minute: "00" });
  const [remind, setRemind] = useState(false);

  useEffect(() => {
    if (appointment) {
      setTitle(appointment.appointment_name || "");
      setLocation(appointment.location || "");

      const start = new Date(appointment.start_time);
      const end = new Date(appointment.end_time);

      setStartTime({
        hour: start.getHours().toString().padStart(2, "0"),
        minute: start.getMinutes().toString().padStart(2, "0"),
      });

      setEndTime({
        hour: end.getHours().toString().padStart(2, "0"),
        minute: end.getMinutes().toString().padStart(2, "0"),
      });

      setRemind(appointment.host.remind || false);
    } else {
      setTitle("");
      setLocation("");
      setStartTime({ hour: "09", minute: "00" });
      setEndTime({ hour: "17", minute: "00" });
      setRemind(false);
    }
  }, [appointment, showModal]);

  const validate = () => {
    if (!title.trim()) return alert("Title is required."), false;
    if (!location.trim()) return alert("Location is required."), false;

    const baseDate = selectedDate || (appointment ? new Date(appointment.start_time) : null);
    if (!baseDate) return alert("No date selected."), false;

    const start = new Date(baseDate);
    start.setHours(parseInt(startTime.hour), parseInt(startTime.minute), 0);
    const end = new Date(baseDate);
    end.setHours(parseInt(endTime.hour), parseInt(endTime.minute), 0);

    if (start >= end) {
      alert("Start time must be before end time.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    let start: Date, end: Date;

    if (selectedDate) {
      start = new Date(selectedDate);
      end = new Date(selectedDate);
      start.setHours(Number(startTime.hour), Number(startTime.minute), 0);
      end.setHours(Number(endTime.hour), Number(endTime.minute), 0);
    } else if (appointment) {
      start = new Date(appointment.start_time);
      end = new Date(appointment.end_time);

      start.setHours(Number(startTime.hour), Number(startTime.minute), 0);
      end.setHours(Number(endTime.hour), Number(endTime.minute), 0);
    } else {
      alert("No date available.");
      return;
    }

    const payload = {
      name: title,
      location,
      start: formatDateTime(start),
      end: formatDateTime(end),
      remind,
    };

    const isEdit = Boolean(appointment?.appointment_id);
    const url = isEdit ? `${process.env.NEXT_PUBLIC_API_URL}/user/appointments/${appointment?.appointment_id}` : `${process.env.NEXT_PUBLIC_API_URL}/user/appointments`;

    const method = isEdit ? "PUT" : "POST";

    const res = await callAPI<resT>(url, { method, body: payload });

    alert(res.message);
    if (res.status === "success") onClose();
  };

  return (
    <div className={`${styles.modalOverlay} ${showModal ? styles.display : ""}`}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.modalClose}>
          ×
        </button>
        <h4>{appointment ? "Edit Appointment" : "Add Appointment"}</h4>
        <p>Date: {selectedDate?.toDateString()}</p>

        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Appointment title" />
        </label>

        <label>
          Location:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        </label>

        <label>
          Start Time:
          <div className={styles.time}>
            <input type="text" value={startTime.hour} onChange={(e) => handleHourChange(setStartTime, e.target.value)} onBlur={() => handleHourBlur(setStartTime, startTime.hour)} maxLength={2} />
            :
            <input
              type="text"
              value={startTime.minute}
              onChange={(e) => handleMinuteChange(setStartTime, e.target.value)}
              onBlur={() => handleMinuteBlur(setStartTime, startTime.minute)}
              maxLength={2}
            />
          </div>
        </label>

        <label>
          End Time:
          <div className={styles.time}>
            <input type="text" value={endTime.hour} onChange={(e) => handleHourChange(setEndTime, e.target.value)} onBlur={() => handleHourBlur(setEndTime, endTime.hour)} maxLength={2} />
            :
            <input type="text" value={endTime.minute} onChange={(e) => handleMinuteChange(setEndTime, e.target.value)} onBlur={() => handleMinuteBlur(setEndTime, endTime.minute)} maxLength={2} />
          </div>
        </label>

        <label className={styles.remindLabel}>
          <span>Remind me</span>
          <button type="button" onClick={() => setRemind((prev) => !prev)} className={`${styles.toggleRemind} ${remind ? styles.active : ""}`} aria-pressed={remind}>
            {remind ? "Yes" : "No"}
          </button>
        </label>

        <button className={styles.saveBtn} onClick={handleSave}>
          {appointment ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
}

export default Modal;
