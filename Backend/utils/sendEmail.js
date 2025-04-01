import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Send email using nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email content in HTML format
 * @returns {Promise<boolean>} - Success status
 */
const sendEmail = async (to, subject, html) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: "gmail", // आप Gmail, Outlook, Yahoo आदि का उपयोग कर सकते हैं
            auth: {
                user: process.env.EMAIL_USER, // आपका ईमेल
                pass: process.env.EMAIL_PASS, // आपका एप पासवर्ड
            },
        });

        // Email options
        const mailOptions = {
            from: `"OneBoss Team" <${process.env.EMAIL_USER}>`,
            to, // प्राप्तकर्ता का ईमेल
            subject, // ईमेल विषय
            html, // ईमेल का HTML कंटेंट
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("Email sending failed:", error);
        return false;
    }
};

export default sendEmail; 