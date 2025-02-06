import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

class Appointment extends Model {
  public id!: number;
  public doctorId!: number;
  public patientId!: number;
  public appointmentDateTime!: Date;
}

Appointment.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    doctorId: { type: DataTypes.INTEGER, allowNull: false },
    patientId: { type: DataTypes.INTEGER, allowNull: false },
    appointmentDateTime: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, tableName: "appointments" }
);

User.hasMany(Appointment, { foreignKey: "doctorId", as: "appointments" });
User.hasMany(Appointment, { foreignKey: "patientId", as: "patientAppointments" });
Appointment.belongsTo(User, { foreignKey: "doctorId", as: "doctor" });
Appointment.belongsTo(User, { foreignKey: "patientId", as: "patient" });

export default Appointment;
