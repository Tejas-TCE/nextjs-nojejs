import Navbar from "../components/Navbar";
import "./globals.css";

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
      </body>
    </html>
  );
} 