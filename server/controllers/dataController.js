import { getAppointmentsByDate } from "../models/dataModels.js";

export async function getAppointmentsByDateController(req, res) {
  const { date } = req.params;

  const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(date);

  if (!isValidDateFormat) {
    return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
  }

  try {
    const result = await getAppointmentsByDate(date);

    const data = result.rows[0]?.get_appointments_by_date;

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch appointments" });
  }
}
