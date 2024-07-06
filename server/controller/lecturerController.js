import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import nodemailer from "nodemailer";
import Lecturers from '../models/LecturerModel.js';

dotenv.config();

const createToken = (id) => {

  return jwt.sign({ userId: id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )
}

// REGISTER LECTURER
export const LecturerRegister = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const existingLecturer = await Lecturers.findOne({ email });
        if (existingLecturer) {
            return res.status(400).json({ success: false, message: "Lecturer is exist with this email" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const lecturer = new Lecturers({ name, email, password: hashedPassword });
        await lecturer.save();

        const lecturerRegToken = createToken(lecturer._id);

        res.status(201).json({
            success: true,
            message: "Lecturer created successfully",
            user: {
                id: lecturer._id,
                name: lecturer.name,
                email: lecturer.email,
                accountType: lecturer.accountType
            },
            token: lecturerRegToken
        });
    } catch (err) {
        next(err);
    }
};

// LOGIN LECTURER
export const lecturerLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const lecture = await Lecturers.findOne({ email });
        if (!lecture) {
            throw new Error("Invalid email");
        }

        const validPassword = bcrypt.compareSync(password, lecture.password);
        if (!validPassword) {
            throw new Error("Invalid password");
        }

        const lectureLogToken = createToken(lecture._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: lecture._id,
                name: lecture.name,
                email: lecture.email,
                accountType: lecture.accountType
            },
            token: lectureLogToken
        });
    } catch (err) {
        next(err);
    }
};
