"use client";

import React, { useEffect, useState } from "react";
import styles from "./SidePanel.module.scss";
import Modal from "./Modal";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import { Appointment } from "../types";
import callAPI from "../utils/callAPI";

type SidePanelProps = {
  selectedDate: Date | null;
  showSidePanel: boolean;
  setShowSidePanel: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SidePanel({ selectedDate, showSidePanel, setShowSidePanel }: SidePanelProps) {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!selectedDate) return;

      const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

      setLoading(true);
      try {
        const response = await callAPI<Appointment[]>(`${process.env.NEXT_PUBLIC_API_URL}/data/${dateString}`);
        setAppointments(response);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate]);

  const handleAppointmentClick = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setShowDetail(true);
  };

  const renderAppointments = () => {
    if (loading) return <p>Loading...</p>;
    if (!appointments) return null;
    if (appointments.length === 0) return <p>No appointments for this date.</p>;

    return (
      <ul className={styles.appointmentList}>
        {appointments.map((appt) => (
          <li key={appt.appointment_id} className={styles.appointmentItem} onClick={() => handleAppointmentClick(appt)}>
            <h4>{appt.appointment_name}</h4>
            <p>
              <strong>Time:</strong>{" "}
              {new Date(appt.start_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(appt.end_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>Host:</strong> {appt.host.user_name}
            </p>
            <p>
              <strong>Location:</strong> {appt.location}
            </p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={`${styles.panel} ${showSidePanel ? styles.expand : ""}`}>
      <button className={styles.closeBtn} onClick={() => setShowSidePanel(false)}>
        ×
      </button>

      <h3>Selected Date</h3>
      <p>{selectedDate?.toDateString()}</p>

      <button className={styles.addBtn} onClick={() => setShowModal(true)}>
        Add Appointment
      </button>

      {renderAppointments()}

      <Modal selectedDate={selectedDate} showModal={showModal} onClose={() => setShowModal(false)} />

      <AppointmentDetailsModal appointment={selectedAppointment} showDetail={showDetail} onClose={() => setShowDetail(false)} />
    </div>
  );
}
