import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

// Register with welcome email after 1 minute
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });
        
        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create User (without email verification)
        user = new User({ name, email, password: hashedPassword });
        await user.save();
        
        // Schedule welcome email after 1 minute
        setTimeout(async () => {
            try {
                const welcomeEmailHTML = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                        <h2 style="color: #3498db; text-align: center;">Welcome to OneBoss!</h2>
                        <p>Hello ${name},</p>
                        <p>Thank you for registering with OneBoss. We're excited to have you on board!</p>
                        <p>Here are some things you can do:</p>
                        <ul>
                            <li>Customize your profile</li>
                            <li>Explore our services</li>
                            <li>Connect with other users</li>
                        </ul>
                        <p>If you have any questions, feel free to contact our support team.</p>
                        <div style="text-align: center; margin-top: 20px; padding: 15px; background-color: #f8f9fa;">
                            <p>Best regards,<br>The OneBoss Team</p>
                        </div>
                    </div>
                `;
                
                await sendEmail(
                    email,
                    "Welcome to OneBoss!",
                    welcomeEmailHTML
                );
                console.log(`Welcome email scheduled and sent to ${email}`);
            } catch (emailError) {
                console.error("Failed to send welcome email:", emailError);
            }
        }, 60000); // 1 minute = 60000 milliseconds
        
        res.status(201).json({ message: 'User registered successfully. Welcome email will be sent shortly.' });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token with user info
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Return token and user info
        res.json({ 
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Change Password with Password History Check
export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

        // Prevent using the last 3 passwords
        for (let oldPass of user.passwordHistory) {
            const isUsedBefore = await bcrypt.compare(newPassword, oldPass);
            if (isUsedBefore) {
                return res.status(400).json({ message: 'Cannot reuse the last 3 passwords' });
            }
        }

        // Store current password in history before updating
        user.passwordHistory.unshift(user.password);
        if (user.passwordHistory.length > 3) {
            user.passwordHistory.pop(); // Keep only last 3 passwords
        }

        // Hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Verify Token
export const verifyToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("_id name");
        if (!user) {
            return res.status(401).json({ valid: false, message: "User not found" });
        }
        res.json({ valid: true, user });
    } catch (error) {
        res.status(401).json({ valid: false, message: "Invalid token" });
    }
};