import express from "express";
import { rateLimit } from 'express-rate-limit';
import {
    adminLogin,
    adminRegister,
    forgetPassword,
    resetAdminPassword,
    getAdminProfile,
    updateAdminProfile,
    getAdminById,
    deleteAdmin,
    getAdmins
} from "../controller/AdminController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // allow a certain number of requests through this window only for 15 minutes

    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)

    standardHeaders: true, // Return how many requests they have left within the current time window.

    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


router.post('/register', limiter, adminRegister);

// here the limiter acts as a traffic controller, ensuring that too many requests don't overload the system.

router.post('/login', limiter, adminLogin);

router.get("/get-admin-profile", userAuth, getAdminProfile);

router.get("/get-admin/:id", userAuth, getAdminById);

router.put("/update-admin", userAuth, updateAdminProfile);

//Delete User
router.delete('/delete-admin/:id', userAuth, deleteAdmin)
//getAllAdmin
router.get("/", getAdmins);

//forget password
router.post("/forget-password", forgetPassword);

//reset password
router.post("/reset-password/:token", resetAdminPassword);

export default router;