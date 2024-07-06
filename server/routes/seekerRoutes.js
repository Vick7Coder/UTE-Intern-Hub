import express from "express";
import { rateLimit } from 'express-rate-limit'
import { getUser, seekerLogin, seekerRegister, updateUser, applyJob, deleteUser, getUserById, getAppliedJobs } from "../controller/seekerController.js";
import userAuth from "../middleware/authMiddleware.js";
import { forgetPassword, resetPassword } from "../controller/seekerController.js";
// Rate limiting prevents the same IP address from making too many requests that will help us prevent attacks like brute force.

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // allow a certain number of requests through this window only for 15 minutes

  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)

  standardHeaders: true, // Return many requests they have left within the current time window.

  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


router.post('/register', limiter, seekerRegister)

// here the limiter acts as a traffic controller, ensuring that too many requests don't overload the system.

router.post('/login', limiter, seekerLogin)

// GET user
router.get("/get-user", userAuth, getUser);

//GET user by Id
router.get('/get-user-profile/:id', userAuth, getUserById)

// UPDATE USER 
router.put("/update-user", userAuth, updateUser);

//Apply Job
router.post("/apply-job/:jobId", userAuth, applyJob);

//Delete User
router.delete('/delete-user/:id', userAuth, deleteUser)

//forget password
router.post("/forget-password", forgetPassword);

//reset password
router.post("/reset-password/:token", resetPassword);

// display apply jobs of seeker
// seekerRoutes.js

router.get("/applied-jobs/:id", userAuth, getAppliedJobs);



export default router;