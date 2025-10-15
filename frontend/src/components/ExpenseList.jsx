import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Table, Button, Popconfirm, message, Typography } from "antd";

const { Text } = Typography;

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

    // Calculate total expense
    const totalExpense = expenses.reduce(
        (sum, exp) => sum + Number(exp.amount || 0),
        0
    );

    const columns = [
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (text) => `₹${text}`,
            responsive: ["xs", "sm", "md", "lg"],
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (text) => new Date(text).toLocaleDateString(),
            responsive: ["xs", "sm", "md", "lg"],
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            responsive: ["xs", "sm", "md", "lg"],
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            responsive: ["xs", "sm", "md", "lg"],
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex gap-2 flex-wrap items-center">
                    <Link to={`/edit/${record._id}`}>
                        <Button type="primary" size="small">
                            Edit
                        </Button>
                    </Link>
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Button type="primary" danger size="small">
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4"
        >
            <Table
                columns={columns}
                dataSource={expenses}
                rowKey="_id"
                pagination={{ pageSize: 5, simple: true }}
                scroll={{ x: "max-content" }}
                summary={() => (
                    <Table.Summary fixed>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>
                                <Text strong>Total</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1} colSpan={4}>
                                <Text strong>
                                    ₹{totalExpense.toLocaleString()}
                                </Text>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
                className="shadow-md rounded-lg"
                bordered
                size="middle"
            />
        </motion.div>
    );
};

export default ExpenseList;
