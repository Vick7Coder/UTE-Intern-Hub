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

        console.log('-----------------------------OK-----------------------');

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
//Send request for email reset password
export const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        //Find the user by email
        const user = await Lecturers.findOne({ email });

        //If user not found, send error message
        if (!user) {
            // return res.status(404).send({ message: "User not found" });
            throw new Error("User Not Found")
        }

        //Generated a unique JWT token for the user that contains the user's id
        const token = jwt.sign({ userId: user._id, userType: 'lecturer' }, process.env.JWT_SECRET, { expiresIn: "10m", });

        //send the token to the user's email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD_APP_EMAIL,
            },
        });

        // Email configuration
        const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: "Reset Password",
            html: `<h1>Reset Your Password</h1>
        <p>Click on the following link to reset your password:</p>
        <a href="http://localhost:5173/lecturer/reset-password/${token}">${token}</a>
        <p>The link will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>`,
        };

        // Send the email
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).send({ message: err.message });
            }
            res.status(200).send({ message: "Email sent" });
        });

    } catch (error) {
        next(error);
    }
};

export const resetLecturerPassword = async (req, res, next) => {
    try {
        // Verify the token sent by the user
        const decodedToken = jwt.verify(
            req.params.token,
            process.env.JWT_SECRET
        );
        // If the token is invalid, return an error
        if (!decodedToken) {
            return res.status(401).send({ message: "Invalid token" });
        }
        const { userId } = decodedToken;
        // find the user with the id from the token
        const user = await Lecturers.findById(userId);
        if (!user) {
            return res.status(401).send({ message: "no user found" });
        }
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);
        // Update user's password, clear reset token and expiration time
        user.password = req.body.newPassword;
        await user.save();
        // Send success response
        res.status(200).send({ message: "Password updated" });
    } catch (error) {
        // Send error response if any error occurs
        next(error);
    }
};
//Update Lecturer Information
export const updateLecturerProfile = async (req, res, next) => {
    const { name, lecId, contact, location, profileUrl, about } = req.body;

    try {
        const id = req.user.userId;  // jwt decoded

        if (!mongoose.Types.ObjectId.isValid(id))
            throw new Error(`No Lecturer with id: ${id}`);

        const updatedLecturer = {
            name,
            contact,
            location,
            lecId,
            profileUrl,
            about,
            _id: id,
        };

        const lecturer = await Lecturers.findByIdAndUpdate(id, updatedLecturer, {
            new: true,
        });

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Lecturer Profile Updated Successfully",
            lecturer: lecturer
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getLecturerProfile = async (req, res, next) => {
    try {
        const id = req.user.userId;

        const lecturer = await Lecturers.findById(id);

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Lecturer Not Found"
            });
        }

        res.status(200).json({
            success: true,
            data: lecturer,
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

// GET ALL LECTURERS
export const getLecturers = async (req, res, next) => {
    try {
        const { search, sort, location } = req.query;

        // conditions for searching filters
        const queryObject = {};

        if (search) {
            queryObject.name = { $regex: search, $options: "i" };
        }

        if (location) {
            queryObject.location = { $regex: location, $options: "i" };
        }

        let queryResult = Lecturers.find(queryObject).select("-password");

        // SORTING
        if (sort === "Newest") {
            queryResult = queryResult.sort("-createdAt");
        }
        if (sort === "Oldest") {
            queryResult = queryResult.sort("createdAt");
        }
        if (sort === "A-Z") {
            queryResult = queryResult.sort("name");  // Changed from "-name" to "name" for A-Z sorting
        }
        if (sort === "Z-A") {
            queryResult = queryResult.sort("-name");  // Changed from "name" to "-name" for Z-A sorting
        }

        // pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        // records count
        const total = await Lecturers.countDocuments(queryObject);
        const numOfPage = Math.ceil(total / limit);

        // apply pagination
        queryResult = queryResult.skip((page - 1) * limit).limit(limit);

        const lecturers = await queryResult;
        res.status(200).json({
            success: true,
            total,
            lecturers: lecturers,
            page,
            numOfPage,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET LECTURER SEEKER LISTING
export const getLecturerSeekerListing = async (req, res, next) => {
    const { search, sort } = req.query;
    const id = req.user.userId;

    try {
        // conditions for searching filters
        const queryObject = {};

        if (search) {
            queryObject.location = { $regex: search, $options: "i" };
        }

        let sorting;
        // sorting
        if (sort === "Newest") {
            sorting = "-createdAt";
        }
        if (sort === "Oldest") {
            sorting = "createdAt";
        }
        if (sort === "A-Z") {
            sorting = "name";
        }
        if (sort === "Z-A") {
            sorting = "-name";
        }

        let queryResult = await Lecturers.findById(id).populate({
            path: "studentLists",
            options: { sort: sorting },
            select: "-password" // Exclude password field
        });

        if (!queryResult) {
            return res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
        }

        res.status(200).json({
            success: true,
            lecturer: {
                _id: queryResult._id,
                name: queryResult.name,
                lecId: queryResult.lecId,
                email: queryResult.email,
                contact: queryResult.contact,
                location: queryResult.location,
                about: queryResult.about,
                profileUrl: queryResult.profileUrl,
                studentLists: queryResult.studentLists
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET SINGLE LECTURER by id
export const getLecturerById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const lecturer = await Lecturers.findById(id).populate({
            path: "studentLists",
            select: "-password", // Loại bỏ trường password khi populate
            options: {
                sort: "-createdAt", // Sắp xếp sinh viên theo thời gian tạo mới nhất
            },
        });

        if (!lecturer) {
            return res.status(404).json({
                success: false,
                message: "Lecturer Not Found"
            });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: lecturer._id,
                name: lecturer.name,
                lecId: lecturer.lecId,
                email: lecturer.email,
                contact: lecturer.contact,
                location: lecturer.location,
                about: lecturer.about,
                profileUrl: lecturer.profileUrl,
                studentLists: lecturer.studentLists
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};