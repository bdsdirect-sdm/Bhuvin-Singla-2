import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/database";
import userRoutes from "./routes/userRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Bhuvin! Welcome to the Express server with Time-Zone.");
});

app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await sequelize.sync({ alter: false });
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
