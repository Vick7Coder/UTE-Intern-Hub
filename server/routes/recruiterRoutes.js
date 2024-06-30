import express  from "express";
import {rateLimit} from 'express-rate-limit';
import { recruiterLogin, recruiterRegister,  getCompanies,
    getCompanyById,
    getCompanyJobListing,
    getCompanyProfile,updateCompanyProfile, forgetPassword, resetRecruiterPassword } from "../controller/recruiterController.js";

import userAuth from "../middleware/authMiddleware.js";

// Rate limiting prevents the same IP address from making too many requests that will help us prevent attacks like brute force.

const  router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // allow a certain number of requests through this window only for 15 minutes

  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)

  standardHeaders: true, // Return how many requests they have left within the current time window.

  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


router.post('/register',limiter, recruiterRegister);

// here the limiter acts as a traffic controller, ensuring that too many requests don't overload the system.

router.post('/login', limiter, recruiterLogin);

// get details

router.get("/get-company-profile", userAuth, getCompanyProfile);
router.get("/get-company-joblisting", userAuth, getCompanyJobListing);
router.get("/", getCompanies);
router.get("/get-company/:id", userAuth, getCompanyById);

// UPDATE DATA
router.put("/update-company", userAuth, updateCompanyProfile);

//forget password
router.post("/forget-password", forgetPassword);

//reset password
router.post("/reset-password/:token", resetRecruiterPassword );

export  default router;