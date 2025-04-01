import FAQ from "../models/Faqs.js";

// ✅ Add New FAQ Controller
export const addFAQ = async (req, res) => {
    try {
        const { question, answer, category } = req.body;

        if (!question || !answer || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Naya FAQ create karein
        const newFAQ = new FAQ({
            user: req.user._id,  // ✅ User ID from token
            question,
            answer,
            category
        });

        await newFAQ.save();

        // ✅ Save ke baad populate karein (user ka name bhi fetch hoga)
        const populatedFAQ = await newFAQ.populate("user", "name _id");

        res.status(201).json({ message: "FAQ added successfully", faq: populatedFAQ });
    } catch (error) {
        res.status(500).json({ message: "Error adding FAQ", error });
    }

};


//get
export const getFAQs = async (req, res) => {
    try {
        let { page, limit, search, showDeleted } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        // Default query - only show non-deleted FAQs
        let query = { isDeleted: false };
        
        // If showDeleted is true, show all FAQs including deleted ones
        if (showDeleted === 'true') {
            query = {};
        }
        
        // Add search filter if provided
        if (search) {
            if (showDeleted !== 'true') {
                // If not showing deleted, keep the isDeleted filter
                query = {
                    $and: [
                        { isDeleted: false },
                        {
                            $or: [
                                { question: { $regex: search, $options: 'i' } },
                                { answer: { $regex: search, $options: 'i' } },
                                { category: { $regex: search, $options: 'i' } }
                            ]
                        }
                    ]
                };
            } else {
                // If showing all, don't filter by isDeleted
                query = {
                    $or: [
                        { question: { $regex: search, $options: 'i' } },
                        { answer: { $regex: search, $options: 'i' } },
                        { category: { $regex: search, $options: 'i' } }
                    ]
                };
            }
        }

        const faqs = await FAQ.find(query)
            .populate("user", "name _id")
            .skip(skip)
            .limit(limit);

        const totalFAQs = await FAQ.countDocuments(query);

        res.status(200).json({
            message: "FAQs fetched successfully",
            totalFAQs,
            currentPage: page,
            totalPages: Math.ceil(totalFAQs / limit),
            faqs
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching FAQs", error });
    }
};



//delete - Hard delete
export const deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Check karein ki FAQ exist karta hai ya nahi
        const faq = await FAQ.findById(id);
        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        // ✅ Ensure karein ki sirf wahi user delete kar sake jo isko create kiya tha
        if (faq.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this FAQ" });
        }

        await FAQ.findByIdAndDelete(id);

        res.status(200).json({ message: "FAQ permanently deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting FAQ", error });
    }
};

// ✅ Soft Delete FAQ Controller
export const softDeleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if FAQ exists
        const faq = await FAQ.findById(id);
        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        // Check if user is authorized
        if (faq.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this FAQ" });
        }

        // Mark as deleted instead of removing
        faq.isDeleted = true;
        faq.deletedAt = new Date();
        await faq.save();

        res.status(200).json({ message: "FAQ moved to trash" });
    } catch (error) {
        console.error("Error soft deleting FAQ:", error);
        res.status(500).json({ message: "Error moving FAQ to trash", error: error.message });
    }
};

// ✅ Restore Soft-Deleted FAQ Controller
export const restoreFAQ = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if FAQ exists
        const faq = await FAQ.findById(id);
        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        // Check if user is authorized
        if (faq.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to restore this FAQ" });
        }

        // Check if the FAQ is actually deleted
        if (!faq.isDeleted) {
            return res.status(400).json({ message: "FAQ is not in trash" });
        }

        // Restore the FAQ
        faq.isDeleted = false;
        faq.deletedAt = null;
        await faq.save();

        res.status(200).json({ message: "FAQ restored successfully" });
    } catch (error) {
        console.error("Error restoring FAQ:", error);
        res.status(500).json({ message: "Error restoring FAQ", error: error.message });
    }
};

// ✅ Edit Existing FAQ Controller
export const editFAQ = async (req, res) => {
    try {
        const { question, answer, category } = req.body;
        const { id } = req.params;

        // Validate input
        if (!question || !answer || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find FAQ
        const faq = await FAQ.findById(id);
        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        // Check if logged-in user is the owner of the FAQ
        if (faq.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        // Update FAQ
        faq.question = question;
        faq.answer = answer;
        faq.category = category;

        await faq.save();

        // Populate and return updated FAQ
        const updatedFAQ = await faq.populate("user", "name _id");

        res.status(200).json({ message: "FAQ updated successfully", faq: updatedFAQ });
    } catch (error) {
        console.error("Error updating FAQ:", error);
        res.status(500).json({ 
            message: "Error updating FAQ", 
            error: error.message 
        });
    }
};


