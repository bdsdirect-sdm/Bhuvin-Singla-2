import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/Profile.css";

const Profile = () => {
  // States
  const [user, setUser] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const navigate = useNavigate();

  // Fetch user data and initialize state
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser.type === 1) {
        // If the user is a doctor, fetch patients and appointments
        fetchPatients(parsedUser.id);
        fetchDoctorAppointments(parsedUser.id);
      } else {
        // If the user is a patient, fetch their appointments
        fetchAppointments(parsedUser.id, parsedUser.timezone);
      }
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Fetch patients for a specific doctor
  const fetchPatients = async (doctorId: number) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/users/patients/${doctorId}`);
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // Fetch doctor appointments and convert times to the respective local time zones
  const fetchDoctorAppointments = async (doctorId: number) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/appointments/doctor/${doctorId}`);
      const convertedAppointments = response.data.map((appointment: any) => {
        const doctorLocalTime = moment
          .utc(appointment.appointmentDateTime)
          .tz(appointment.doctor.timezone)
          .format("YYYY-MM-DD hh:mm A");
        const patientLocalTime = moment
          .utc(appointment.appointmentDateTime)
          .tz(appointment.patient.timezone)
          .format("YYYY-MM-DD hh:mm A");

        return {
          ...appointment,
          doctorLocalTime,
          patientLocalTime,
        };
      });
      setAppointments(convertedAppointments);
    } catch (error) {
      console.error("Error fetching doctor appointments:", error);
    }
  };

  // Fetch patient appointments and convert times to their local timezone
  const fetchAppointments = async (patientId: number, timezone: string) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/appointments/${patientId}`);
      const convertedAppointments = response.data.map((appointment: any) => {
        const doctorLocalTime = moment
          .utc(appointment.appointmentDateTime)
          .tz(appointment.doctor.timezone)
          .format("YYYY-MM-DD hh:mm A");
        const patientLocalTime = moment
          .utc(appointment.appointmentDateTime)
          .tz(timezone)
          .format("YYYY-MM-DD hh:mm A");

        return {
          ...appointment,
          doctorLocalTime,
          patientLocalTime,
        };
      });
      setAppointments(convertedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Schedule a new appointment
  const scheduleAppointment = async (patientId: number) => {
    if (!selectedDate) {
      alert("Please select a date and time.");
      return;
    }

    try {
      // Convert selected date to UTC format for backend storage
      const utcDateTime = moment.tz(selectedDate, user.timezone).utc().format();

      await axios.post("http://localhost:4000/api/appointments/create", {
        doctorId: user.id,
        patientId,
        dateTime: utcDateTime,
        timezone: user.timezone, // Add user timezone for reference on backend
      });

      alert("Appointment scheduled!");
      setSelectedDate(null); // Clear selected date after scheduling
    } catch (error) {
      console.error("Error scheduling appointment:", error);
    }
  };

  // Component JSX
  return (
    <div className="profile-container">
      <button onClick={handleLogout}>Logout</button>
      <h1>Welcome, {user?.firstName}</h1>
      <p>Role: {user?.type === 1 ? "Doctor" : "Patient"}</p>

      {user?.type === 1 ? (
        // Doctor view: Patients and appointments
        <div className="list-container">
          <h2>Your Patients</h2>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <div key={patient.id} className="patient-item">
                <span>
                  {patient.firstName} {patient.lastName} ({patient.email})
                </span>
                <div className="date-picker-container">
                  <h3>Select Appointment Date and Time</h3>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    timeIntervals={15}
                    timeCaption="Time"
                    minDate={new Date()}
                  />
                  <button
                    onClick={() => scheduleAppointment(patient.id)}
                    disabled={!selectedDate}
                  >
                    Schedule Appointment
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No patients yet.</p>
          )}

          <h2>Your Appointments</h2>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="appointment-item">
                <span>
                  Doctor (Your Time): {appointment.doctor.firstName}{" "}
                  {appointment.doctor.lastName} - {appointment.patientLocalTime}
                  <br />
                  Patient Appointment Time: {appointment.doctorLocalTime}
                </span>
              </div>
            ))
          ) : (
            <p className="no-data">No appointments yet.</p>
          )}
        </div>
      ) : (
        // Patient view: Appointments only
        <div className="list-container">
          <h2>Your Appointments</h2>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="appointment-item">
                <span>
                  Doctor: {appointment.doctor.firstName}{" "}
                  {appointment.doctor.lastName} - {appointment.doctorLocalTime}
                  <br />
                  Patient Appointment Time (Your Time):{" "}
                  {appointment.patientLocalTime}
                </span>
              </div>
            ))
          ) : (
            <p className="no-data">No appointments yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
