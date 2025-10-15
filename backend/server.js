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

// MongoDB connection (optimized for Vercel)
let isConnected;

async function connectDB() {
    if (isConnected) return;
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = conn.connections[0].readyState;
        console.log("✅ MongoDB connected successfully");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
}

connectDB();

app.get("/", (req, res) => {
    res.send("Expense Tracker Backend is running 🚀");
});

app.use("/api/expenses", expenseRoutes);

// For Vercel serverless function
module.exports = app;
module.exports.handler = serverless(app);
