import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Table, Button, Popconfirm, message } from "antd";

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/expenses")
            .then((res) => setExpenses(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:5000/api/expenses/${id}`)
            .then(() => setExpenses(expenses.filter((exp) => exp._id !== id)))
            .then(message.success("Expense deleted!"))
            .catch((err) => console.error(err));
    };

    const columns = [
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (text) => `${text}`,
            responsive: ["xs", "sm", "md"],
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (text) => new Date(text).toLocaleDateString(),
            responsive: ["xs", "sm", "md"],
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            responsive: ["xs", "sm", "md"],
        }, // Hide on xs if too wide
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            responsive: ["xs", "sm", "md"],
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <>
                    <Link to={`/edit/${record._id}`} className="mr-2">
                        Edit
                    </Link>
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </>
            ),
            responsive: ["xs", "sm", "md"],
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Table
                columns={columns}
                dataSource={expenses}
                rowKey="_id"
                // Simpler pagination on mobile
                pagination={{ pageSize: 5, simple: true }}
                // Horizontal scroll on mobile
                scroll={{ x: "max-content" }}
            />
        </motion.div>
    );
};

export default ExpenseList;
