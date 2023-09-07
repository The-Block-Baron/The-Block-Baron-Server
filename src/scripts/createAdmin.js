import mongoose from "mongoose";
import dotenv from 'dotenv';
import Admin from "../models/admin.model.js";  // Import the Admin model

dotenv.config();

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Check if an admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@email.com" });
    
    if (!existingAdmin) {
      // Admin data
      const adminData = { username: process.env.ADMIN1_USERNAME, email: process.env.ADMIN1_EMAIL, password: process.env.ADMIN1_PASSWORD };
      
      // Create admin
      const admin = new Admin(adminData);
      await admin.save();
      console.log('Admin created');
    } else {
      console.log('Admin already exists');
    }
    
  } catch (error) {
    console.error('Failed to seed database', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
};

// Run the function
seedDB();
