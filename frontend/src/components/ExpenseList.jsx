import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Table, Button, Popconfirm, message } from "antd";

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const API_BASE = import.meta.env.VITE_API_BASE_URI;

    useEffect(() => {
        axios
            .get(`${API_BASE}/`)
            .then((res) => setExpenses(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleDelete = (id) => {
        axios
            .delete(`${API_BASE}/${id}`)
            .then(() => {
                setExpenses(expenses.filter((exp) => exp._id !== id));
                message.success("Expense deleted!");
            })
            .catch((err) => {
                console.error(err);
                message.error("Failed to delete expense.");
            });
    };

    const columns = [
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (text) => `${text}`,
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
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
                pagination={{ pageSize: 5, simple: true }}
                scroll={{ x: "max-content" }}
            />
        </motion.div>
    );
};

export default ExpenseList;
