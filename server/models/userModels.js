import { executeQuery } from "../db.js";

export async function addAppointment({ userId, name, location, start, end, remind = false }) {
  const result = await executeQuery(`SELECT * FROM add_appointment($1, $2, $3, $4, $5, $6)`, [userId, name, location, start, end, remind]);

  return result.rows[0];
}

export async function replaceAppointment({ appointmentId, userId, name, location, start, end, remind }) {
  const result = await executeQuery(`SELECT * FROM replace_appointment($1, $2, $3, $4, $5, $6, $7)`, [appointmentId, userId, name, location, start, end, remind]);

  return result.rows[0];
}

export async function joinAppointment({ appointmentId, userId, remind = false }) {
  const result = await executeQuery(`SELECT * FROM join_appointment($1, $2, $3)`, [appointmentId, userId, remind]);

  return result.rows[0];
}

export async function deleteAppointment(appointmentId) {
  const result = await executeQuery(`SELECT * FROM delete_appointment($1)`, [appointmentId]);

  return result.rows[0];
}

export async function toggleReminder(appointmentId, userId) {
  const result = await executeQuery(`SELECT toggle_remind_status($1, $2)`, [appointmentId, userId]);

  return result;
}
