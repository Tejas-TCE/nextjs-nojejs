import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ User Reference
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }, // ✅ Soft delete flag
    deletedAt: { type: Date, default: null }      // ✅ Timestamp for soft delete
}, { timestamps: true });

const FAQ = mongoose.model("FAQ", faqSchema);
export default FAQ;


    