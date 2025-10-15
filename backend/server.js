const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const serverless = require("serverless-http");
const expenseRoutes = require("./routes/expenses");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Maintain a single MongoDB connection across serverless calls
let cachedDb = null;

async function connectDB() {
    if (cachedDb && mongoose.connection.readyState === 1) {
        console.log("⚡ Using existing MongoDB connection");
        return cachedDb;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // Prevent long hanging connections
        });
        cachedDb = conn;
        console.log("✅ MongoDB connected successfully");
        return conn;
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
    }
}

// Middleware to ensure DB is connected before each request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.get("/", (req, res) => {
    res.send("🚀 Expense Tracker Backend is running on Vercel");
});

app.use("/api/expenses", expenseRoutes);

// ✅ Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
