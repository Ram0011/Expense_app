import { Layout } from "antd";
const { Footer } = Layout;

const FooterComponent = () => {
    return (
        <Footer
            className=" !text-lg !md:text-xl !font-semibold text-center py-6"
            style={{ background: "#F3F8FF" }}
        >
            Created by{" "}
            <a
                href="https://ramprakash-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline transition-colors duration-300"
            >
                @Ram
            </a>
        </Footer>
    );
};

export default FooterComponent;
