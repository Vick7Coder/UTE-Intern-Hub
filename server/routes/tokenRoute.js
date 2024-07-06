import express from "express";
import userAuth from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/checkToken", userAuth);


export default router;