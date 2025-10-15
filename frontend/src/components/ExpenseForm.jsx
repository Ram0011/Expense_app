import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
    Form,
    Input,
    DatePicker,
    Select,
    Button,
    Card,
    Row,
    Col,
    message,
} from "antd";
import dayjs from "dayjs";

const { Option } = Select;

// ✅ Use the base URL from your Vite environment
const API_BASE = import.meta.env.VITE_API_BASE_URI;

const ExpenseForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    useEffect(() => {
        if (id) {
            axios
                .get(`${API_BASE}/${id}`)
                .then((res) => {
                    const data = res.data;
                    form.setFieldsValue({ ...data, date: dayjs(data.date) });
                })
                .catch((err) => {
                    console.error(err);
                    message.error("Failed to load expense details.");
                });
        }
    }, [id, form]);

    const onFinish = (values) => {
        const payload = { ...values, date: values.date.toDate() };
        const method = id ? "put" : "post";
        const url = id ? `${API_BASE}/${id}` : API_BASE;

        axios[method](url, payload)
            .then(() => {
                message.success(
                    id
                        ? "Expense updated successfully!"
                        : "Expense added successfully!"
                );
                navigate("/");
            })
            .catch((err) => {
                console.error(err);
                message.error("Something went wrong. Please try again.");
            });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <Row justify="center">
                <Col xs={24} sm={18} md={12} lg={8}>
                    <Card title={id ? "Edit Expense" : "Add Expense"}>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Form.Item
                                name="amount"
                                label="Amount"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input amount!",
                                    },
                                ]}
                            >
                                <Input type="number" />
                            </Form.Item>

                            <Form.Item
                                name="date"
                                label="Date"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select date!",
                                    },
                                ]}
                            >
                                <DatePicker className="w-full" />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input description!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="category"
                                label="Category"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select category!",
                                    },
                                ]}
                            >
                                <Select>
                                    <Option value="Food">Food</Option>
                                    <Option value="Rent">Rent</Option>
                                    <Option value="Entertainment">
                                        Entertainment
                                    </Option>
                                    <Option value="Transportation">
                                        Transportation
                                    </Option>
                                    <Option value="Health">Health</Option>
                                    <Option value="Education">Education</Option>
                                    <Option value="Shopping">Shopping</Option>
                                    <Option value="Other">Other</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-full"
                                >
                                    {id ? "Update" : "Add"}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </motion.div>
    );
};

export default ExpenseForm;
