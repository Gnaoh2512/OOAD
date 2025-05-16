import { executeQuery } from "../db.js";

export async function getAppointmentsByDate(date) {
  const result = await executeQuery(`SELECT get_appointments_by_date($1)`, [date]);

  return result;
}
