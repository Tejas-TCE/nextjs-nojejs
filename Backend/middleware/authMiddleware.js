import jwt from "jsonwebtoken";
import User from "../models/User.js";


const protect = async (req, res, next) => {
    let token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // Remove 'Bearer ' prefix if present
        token = token.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("_id name"); // ✅ User info fetch
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export { protect };


