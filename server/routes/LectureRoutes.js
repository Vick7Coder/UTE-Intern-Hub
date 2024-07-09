import express from "express";
import { rateLimit } from 'express-rate-limit';
import {
    lecturerLogin,
    LecturerRegister,
    forgetPassword,
    resetLecturerPassword,
    getLecturerProfile,
    getLecturerSeekerListing,
    getLecturers,
    getLecturerById,
    updateLecturerProfile,
    addSeekerToLecturer,
    getLecturerStudents,
    getLecturerByLecId,
    removeSeekerFromLecturer
} from "../controller/lecturerController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // allow a certain number of requests through this window only for 15 minutes

    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)

    standardHeaders: true, // Return how many requests they have left within the current time window.

    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
router.post('/register', limiter, LecturerRegister);

// here the limiter acts as a traffic controller, ensuring that too many requests don't overload the system.

router.post('/login', limiter, lecturerLogin);

router.post("/forget-password", forgetPassword);

//reset password
router.post("/reset-password/:token", resetLecturerPassword);

// Lấy thông tin
router.get("/get-lecturer-profile", userAuth, getLecturerProfile);
router.get("/get-lecturer-seekerlisting", userAuth, getLecturerSeekerListing);
router.get("/", getLecturers);
router.get("/get-lecturer/:id", userAuth, getLecturerById);
router.get("/get-lecturer-i4/:lecId", userAuth, getLecturerByLecId);

// Cập nhật thông tin
router.put("/update-lecturer", userAuth, updateLecturerProfile);

// route to add a seeker to a lecturer's student lists
router.post("/add-seeker-to-lecturer", userAuth, addSeekerToLecturer);

router.get("/lecturer-students", userAuth, getLecturerStudents);

router.post('/remove-seeker', userAuth, removeSeekerFromLecturer);


export default router;