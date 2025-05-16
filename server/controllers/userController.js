import { addAppointment, replaceAppointment, joinAppointment, deleteAppointment, toggleReminder } from "../models/userModels.js";

export async function addAppointmentController(req, res) {
  try {
    const userId = req.user.id;
    const { name, location, start, end, remind } = req.body;

    if (!userId || !name || !start || !end) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await addAppointment({
      userId,
      name,
      location,
      start,
      end,
      remind,
    });

    return res.status(201).json({
      status: result.status,
      message: result.message,
      appointmentId: result.appointment_id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function replaceAppointmentController(req, res) {
  try {
    const { appointmentId } = req.params;
    const { name, location, start, end, remind } = req.body;

    console.log(req.body);

    if (!name || !start || !end) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await replaceAppointment({
      appointmentId: parseInt(appointmentId),
      userId: req.user.id,
      name,
      location,
      start,
      end,
      remind,
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function joinAppointmentController(req, res) {
  try {
    const { appointmentId } = req.params;
    const { remind } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const result = await joinAppointment({
      appointmentId: parseInt(appointmentId),
      userId: parseInt(userId),
      remind: remind === true,
    });

    return res.status(200).json({ message: result.message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function deleteAppointmentController(req, res) {
  try {
    const { appointmentId } = req.params;

    const result = await deleteAppointment(parseInt(appointmentId));

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function toggleReminderController(req, res) {
  try {
    const { appointmentId } = req.params;

    await toggleReminder(parseInt(appointmentId), req.user.id);

    return res.status(200).json({ message: "Successfully toggle" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
