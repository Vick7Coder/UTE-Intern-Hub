import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Admins from '../models/AdminModel';

dotenv.config();

const createToken = (id) => {
    return jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// REGISTER ADMIN
export const adminRegister = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const existingAdmin = await Admins.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: "Email đã tồn tại" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const admin = new Admins({ name, email, password: hashedPassword });
        await admin.save();

        const adminRegToken = createToken(admin._id);

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                accountType: admin.accountType
            },
            token: adminRegToken
        });
    } catch (err) {
        next(err);
    }
};

// LOGIN ADMIN
export const adminLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const admin = await Admins.findOne({ email });
        if (!admin) {
            throw new Error("Invalid email");
        }

        const validPassword = bcrypt.compareSync(password, admin.password);
        if (!validPassword) {
            throw new Error("Invalid password");
        }

        const adminLogToken = createToken(admin._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                accountType: admin.accountType
            },
            token: adminLogToken
        });
    } catch (err) {
        next(err);
    }
};

// UPDATE ADMIN PROFILE (tương tự updateCompanyProfile)
// GET ADMIN PROFILE (tương tự getCompanyProfile)

// GET ALL ADMINS (chỉ dành cho admin khác)
// GET ADMIN BY ID (chỉ dành cho admin khác)
