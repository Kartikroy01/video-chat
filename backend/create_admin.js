import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const adminEmail = "admin@studentconnect.com";
    const adminPassword = "admin123";

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      console.log(`Email: ${adminEmail}`);
      console.log("Password: (unchanged)");
      process.exit(0);
    }

    // Create new admin
    const admin = new User({
      name: "System Admin",
      email: adminEmail,
      password: adminPassword,
      institutionName: "StudentConnect University",
      course: "Administration",
      year: "4th",
      role: "admin",
      isVerified: true,
      isApproved: true,
      anonymousName: "AdminBot",
    });

    await admin.save();

    console.log("Admin account created successfully!");
    console.log("=====================================");
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log("=====================================");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
