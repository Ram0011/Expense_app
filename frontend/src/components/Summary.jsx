import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    DatePicker,
    List,
    Card,
    Row,
    Col,
    Select,
    Empty,
    Statistic,
    Divider,
} from "antd";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Summary = () => {
    const [summary, setSummary] = useState([]);
    const [dates, setDates] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [totalAll, setTotalAll] = useState(0);

    const API_BASE = import.meta.env.VITE_API_BASE_URI;

    // Fetch unique categories on mount
    useEffect(() => {
        axios
            .get(API_BASE)
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
            .get(`${API_BASE}/summary`, { params })
            .then((res) => {
                setSummary(res.data);
                const total = res.data.reduce(
                    (sum, item) => sum + Number(item.total || 0),
                    0
                );
                setTotalAll(total);
            })
            .catch((err) => console.error(err));
    }, [dates, selectedCategories]);

    const handleDateChange = (dates) => setDates(dates);
    const handleCategoryChange = (value) => setSelectedCategories(value);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4"
        >
            <Row justify="center">
                <Col xs={24} sm={20} md={16} lg={10}>
                    <Card
                        title="Expense Summary"
                        bordered={false}
                        className="shadow-md rounded-lg"
                    >
                        <div className="mb-4">
                            <h5 className="text-md font-semibold mb-2">
                                Select Category
                            </h5>
                            <Select
                                mode="multiple"
                                allowClear
                                placeholder="Select categories (all by default)"
                                onChange={handleCategoryChange}
                                value={selectedCategories}
                                className="w-full"
                            >
                                {allCategories.map((cat) => (
                                    <Option key={cat} value={cat}>
                                        {cat}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div className="mb-4">
                            <h5 className="text-md font-semibold mb-2">
                                Select Date
                            </h5>
                            <RangePicker
                                onChange={handleDateChange}
                                className="w-full"
                            />
                        </div>

                        {/* Grand Total Display */}
                        <Card
                            className="mb-4 bg-blue-50"
                            size="small"
                            bordered={false}
                        >
                            <Statistic
                                title="Total Expense (All Categories)"
                                value={totalAll}
                                precision={2}
                                prefix="₹"
                            />
                        </Card>

                        <Divider />

                        {/* Per-category summary */}
                        {summary.length === 0 ? (
                            <Empty description="No data available" />
                        ) : (
                            <List
                                dataSource={summary}
                                renderItem={(item, index) => {
                                    const max = Math.max(
                                        ...summary.map((s) => s.total),
                                        1
                                    );
                                    const width = `calc(${
                                        (item.total / max) * 100
                                    }%)`;

                                    const barClass =
                                        "bg-gray-400 text-black p-2 rounded flex justify-between items-center";

                                    return (
                                        <List.Item key={item._id}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width }}
                                                transition={{
                                                    delay: index * 0.1,
                                                    duration: 0.5,
                                                }}
                                                className={barClass}
                                            >
                                                <span>{item._id}</span>
                                                <span>
                                                    ₹
                                                    {item.total.toLocaleString()}
                                                </span>
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
