import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import "./Navbar.css";

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    const items = [
        { key: "1", label: <Link to="/">Expenses</Link> },
        { key: "2", label: <Link to="/add">Add Expense</Link> },
        { key: "3", label: <Link to="/summary">Summary</Link> },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
                background: "#1890ff",
                padding: "0 24px",
                height: "64px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
            }}
        >
            {/* Logo */}
            <div
                style={{
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                }}
                onClick={() => navigate("/")}
            >
                Expense Tracker
            </div>

            {/* Desktop Menu */}
            <div className="navbar-menu">
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectable={false}
                    items={items}
                    style={{
                        background: "transparent",
                        borderBottom: "none",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "16px",
                    }}
                    overflowedIndicator={null}
                    inlineCollapsed={false}
                />
            </div>

            {/* Mobile Hamburger */}
            <Button
                className="mobile-menu-button"
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setVisible(true)}
                style={{ color: "white" }}
            />

            {/* Drawer for mobile */}
            <Drawer
                title="Menu"
                placement="right"
                onClose={() => setVisible(false)}
                open={visible}
                styles={{ body: { padding: 0 } }}
            >
                <Menu
                    mode="vertical"
                    items={items}
                    onClick={() => setVisible(false)}
                />
            </Drawer>
        </motion.div>
    );
};

export default Navbar;
