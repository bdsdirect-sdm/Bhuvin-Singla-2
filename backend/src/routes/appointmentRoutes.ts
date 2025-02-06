import express from "express";
import Appointment from "../models/Appointment";
import User from "../models/User";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { doctorId, patientId, dateTime, timezone } = req.body;

    const newAppointment = await Appointment.create({
      doctorId,
      patientId,
      appointmentDateTime: dateTime,
      timezone,
    });

    res.status(201).json({ message: "Appointment scheduled", appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ error: "Error creating appointment" });
  }
});

router.get("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const appointments = await Appointment.findAll({
      where: { patientId },
      include: [{ model: User, as: "doctor" }],
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching appointments" });
  }
});
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const appointments = await Appointment.findAll({
      where: { doctorId },
      include: [
        { model: User, as: 'doctor' },
        { model: User, as: 'patient' }
      ]
    });
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching doctor's appointments:", error);
    res.status(500).json({ error: "Error fetching doctor's appointments" });
  }
});

export default router;
