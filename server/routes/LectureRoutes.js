import express from "express";
import {rateLimit} from 'express-rate-limit';
import { lecturerLogin, LecturerRegister } from "../controller/lecturerController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // allow a certain number of requests through this window only for 15 minutes

    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)

    standardHeaders: true, // Return how many requests they have left within the current time window.

    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
router.post('/register',limiter, LecturerRegister);

// here the limiter acts as a traffic controller, ensuring that too many requests don't overload the system.

router.post('/login', limiter, lecturerLogin);

export default router;