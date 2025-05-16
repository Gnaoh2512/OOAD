"use client";

import React, { useState } from "react";
import styles from "./AppointmentDetailsModal.module.scss";
import { Appointment } from "../types";
import { useAuth } from "../providers/authProvider";
import Modal from "./Modal";
import callAPI from "../utils/callAPI";

type Props = {
  appointment: Appointment | null;
  showDetail: boolean;
  onClose: () => void;
};

export default function AppointmentDetailsModal({ appointment, showDetail, onClose }: Props) {
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  const isHost = user?.user_id === appointment?.host.user_id;

  const handleJoin = async () => {
    const isExistingParticipant = appointment?.participants?.some((part) => part.user_id === user?.user_id);

    const response = await callAPI<{ message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/user/appointments/${appointment?.appointment_id}/join`, {
      method: isExistingParticipant ? "PUT" : "POST",
      ...(isExistingParticipant ? {} : { body: { remind: true } }),
    });

    alert(response.message);
  };

  const handleDelete = async () => {
    if (!appointment) return;
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      const response = await callAPI<{ message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/user/appointments/${appointment.appointment_id}`, {
        method: "DELETE",
      });

      alert(response.message);
      if (response.message.toLowerCase().includes("success")) {
        onClose();
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={`${styles.backdrop} ${showDetail ? styles.display : ""}`} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        <h2>{appointment?.appointment_name}</h2>

        <p>
          <strong>Time:</strong> {appointment?.start_time ? new Date(appointment.start_time).toLocaleString() : ""} - {appointment?.end_time ? new Date(appointment.end_time).toLocaleString() : ""}
        </p>

        <p>
          <strong>Host:</strong> {appointment?.host.user_name}
        </p>

        <p>
          <strong>Location:</strong> {appointment?.location}
        </p>

        <p>
          <strong>Participants:</strong> {appointment?.participants && appointment.participants.length > 0 ? appointment.participants.map((p) => p.user_name).join(", ") : "No participant"}
        </p>

        <div className={styles.btnContainer}>
          {isHost ? (
            <>
              <button className={styles.dynamicBtn} onClick={() => setShowEditModal(true)}>
                Edit Appointment
              </button>
              <button className={styles.dynamicBtn} style={{ backgroundColor: "red", marginLeft: "10px" }} onClick={handleDelete}>
                Delete Appointment
              </button>
            </>
          ) : (
            <button className={styles.dynamicBtn} onClick={handleJoin}>
              {!appointment?.participants?.some((part) => part.user_id === user?.user_id)
                ? "Join Group Meeting"
                : appointment.participants.find((part) => part.user_id === user?.user_id)?.remind
                ? "Turn off reminder"
                : "Turn on reminder"}
            </button>
          )}
        </div>

        <Modal appointment={appointment} showModal={showEditModal} onClose={() => setShowEditModal(false)} />
      </div>
    </div>
  );
}
