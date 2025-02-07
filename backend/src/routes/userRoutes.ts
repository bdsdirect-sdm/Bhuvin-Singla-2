import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
import Appointment from "../models/Appointment";
dotenv.config();
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, type, timezone } = req.body;
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: password,
      type,
      timezone,
    });

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login request:", { email, password });

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Access password from dataValues
    const storedPassword = user.dataValues.password;
    console.log("Stored Password:", storedPassword);  // Log stored password

    // Directly compare the entered password with the stored password
    if (password !== storedPassword) {
      console.log(" Password does not match");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("✅ User authenticated successfully");

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, type: user.type, timezone: user.timezone },
      "your_secret_key",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error logging in" });
  }
});

router.get("/patients/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;
    const patients = await User.findAll({ where: { type: 2 } });
    res.json(patients);
  }
  catch (error: any) {
    res.status(500).json({ error: "Error fetching patients" });
  }
});

export default router;
