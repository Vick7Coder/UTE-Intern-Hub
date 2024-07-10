import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  createJob,
  deleteJobPost,
  getJobById,
  getJobPosts,
  updateJob,
  acceptApplicant,
  removeSeekerFromApplicants,
  removeAcceptedApplicant
} from "../controller/jobController.js"

const router = express.Router();

// POST JOB
router.post("/upload-job", userAuth, createJob);

// UPDATE JOB
router.put("/update-job/:jobId", userAuth, updateJob);

// GET JOB POST
router.get("/find-jobs", getJobPosts);
router.get("/get-job-detail/:id", getJobById);

// DELETE JOB POST
router.delete("/delete-job/:jobId", userAuth, deleteJobPost);
// Accepted applicant
router.post("/accept-user/:userId", userAuth, acceptApplicant);

// Remove seeker from applicants
router.delete("/remove-applicant/:jobId/:seekerId", userAuth, removeSeekerFromApplicants);

// Remove accepted applicant
router.delete("/remove-accepted-applicant/:userId", userAuth, removeAcceptedApplicant);
export default router;
