import Navbar from "../components/Navbar";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "OneBoss - Business Management Platform",
  description: "Streamline your business operations with OneBoss",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <ToastContainer position="top-right" autoClose={3000}  />
      </body>
    </html>
  );
} 