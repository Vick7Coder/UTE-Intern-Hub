import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  createJob,
  deleteJobPost,
  getJobById,
  getJobPosts,
  updateJob,
  acceptApplicant,
  // getAppliedJobs,
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
// Thêm cái này cho accepted applicant
router.post("/accept-user/:userId", userAuth, acceptApplicant);

// router.get("/applied-jobs", protect, getAppliedJobs);
export default router;
