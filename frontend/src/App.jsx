import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";
import Summary from "./components/Summary";
import Navbar from "./components/Navbar";
import { ConfigProvider, Layout } from "antd";
import FooterComponent from "./components/FooterComponent";

const { Content } = Layout;

function App() {
    return (
        <ConfigProvider>
            <Router>
                <Layout
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Navbar />
                    <Content style={{ padding: "16px" }}>
                        <motion.main
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Routes>
                                <Route path="/" element={<ExpenseList />} />
                                <Route path="/add" element={<ExpenseForm />} />
                                <Route
                                    path="/edit/:id"
                                    element={<ExpenseForm />}
                                />
                                <Route path="/summary" element={<Summary />} />
                            </Routes>
                        </motion.main>
                    </Content>
                    <FooterComponent />
                </Layout>
            </Router>
        </ConfigProvider>
    );
}

export default App;
