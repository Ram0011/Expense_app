import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { DatePicker, List, Card, Row, Col, Select, Empty } from "antd";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Summary = () => {
    const [summary, setSummary] = useState([]);
    const [dates, setDates] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);

    // Fetch unique categories on mount
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/expenses")
            .then((res) => {
                const categories = [
                    ...new Set(res.data.map((exp) => exp.category)),
                ];
                setAllCategories(categories);
            })
            .catch((err) => console.error(err));
    }, []);

    // Fetch summary when dates or categories change
    useEffect(() => {
        const params = {};
        if (dates && dates[0]) params.startDate = dates[0].toISOString();
        if (dates && dates[1]) params.endDate = dates[1].toISOString();
        if (selectedCategories.length > 0)
            params.categories = selectedCategories.join(",");

        axios
            .get("http://localhost:5000/api/expenses/summary", { params })
            .then((res) => setSummary(res.data))
            .catch((err) => console.error(err));
    }, [dates, selectedCategories]);

    const handleDateChange = (dates) => {
        setDates(dates);
    };

    const handleCategoryChange = (value) => {
        setSelectedCategories(value);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Row justify="center">
                <Col xs={24} sm={18} md={12} lg={8}>
                    <Card title="Category Summary">
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Select categories (all by default)"
                            onChange={handleCategoryChange}
                            className="mb-4 w-full"
                            value={selectedCategories}
                            style={{ marginBottom: "11px" }}
                        >
                            {allCategories.map((cat) => (
                                <Option key={cat} value={cat}>
                                    {cat}
                                </Option>
                            ))}
                        </Select>
                        <RangePicker
                            onChange={handleDateChange}
                            className="mb-4 w-full"
                        />
                        {summary.length === 0 ? (
                            <Empty description="No data" />
                        ) : (
                            <List
                                dataSource={summary}
                                renderItem={(item, index) => {
                                    const max = Math.max(
                                        ...summary.map((s) => s.total),
                                        1
                                    );
                                    return (
                                        <List.Item>
                                            <motion.div
                                                key={item._id}
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{
                                                    delay: index * 0.1,
                                                    duration: 0.5,
                                                }}
                                                className="bg-blue-600 text-white p-2 rounded flex justify-between"
                                                style={{
                                                    width: `calc(${
                                                        (item.total / max) * 100
                                                    }%)`,
                                                }}
                                            >
                                                <span>{item._id}</span>
                                                <span>₹{item.total}</span>
                                            </motion.div>
                                        </List.Item>
                                    );
                                }}
                            />
                        )}
                    </Card>
                </Col>
            </Row>
        </motion.div>
    );
};

export default Summary;
