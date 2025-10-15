const express = require("express");
const Expense = require("../models/Expense");

const router = express.Router();

//Test
router.get("/test", (req, res) => {
    res.send("Backend working");
});

// Create expense
router.post("/", async (req, res) => {
    try {
        const newExpense = new Expense(req.body);
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (err) {
        res.status(400).json({
            message: "Error saving expense",
            error: err.message,
        });
    }
});

// Get all expenses
router.get("/", async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({
            message: "Error fetching expenses",
            error: err.message,
        });
    }
});

// Get summary by category with date and category filters
router.get("/summary", async (req, res) => {
    const { startDate, endDate, categories } = req.query;
    const match = {};
    if (startDate) {
        match.date = { $gte: new Date(startDate) };
    }
    if (endDate) {
        match.date = { ...match.date, $lte: new Date(endDate) };
    }
    if (categories) {
        const categoryArray = categories.split(","); // ?categories=Food,Rent
        match.category = { $in: categoryArray };
    }

    try {
        const summary = await Expense.aggregate([
            { $match: match },
            { $group: { _id: "$category", total: { $sum: "$amount" } } },
            { $sort: { total: -1 } },
        ]);
        res.json(summary);
    } catch (err) {
        res.status(500).json({
            message: "Error generating summary",
            error: err.message,
        });
    }
});

// Get single expense
router.get("/:id", async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.json(expense);
    } catch (err) {
        res.status(500).json({
            message: "Error fetching expense",
            error: err.message,
        });
    }
});

// Update expense
router.put("/:id", async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.json(updatedExpense);
    } catch (err) {
        res.status(400).json({
            message: "Error updating expense",
            error: err.message,
        });
    }
});

// Delete expense
router.delete("/:id", async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.json({ message: "Expense deleted successfully" });
    } catch (err) {
        res.status(500).json({
            message: "Error deleting expense",
            error: err.message,
        });
    }
});

module.exports = router;
