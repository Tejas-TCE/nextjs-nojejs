import express from "express";
// import FAQ from "../models/Faqs.js";
import { protect } from "../middleware/authMiddleware.js";
import { addFAQ, editFAQ, getFAQs, deleteFAQ, softDeleteFAQ, restoreFAQ } from "../controllers/faqcontroller.js";


const router = express.Router();

// ✅ Add New FAQ
router.post("/add", protect, addFAQ); 
//Edit FAQ Route
router.put("/edit/:id", protect, editFAQ);
// Get All FAQs
router.get("/faqall", protect, getFAQs);
//Hard Delete FAQ Route
router.delete("/delete/:id", protect, deleteFAQ);
//Soft Delete FAQ Route
router.put("/soft-delete/:id", protect, softDeleteFAQ);
//Restore FAQ from trash
router.put("/restore/:id", protect, restoreFAQ);

export default router;
