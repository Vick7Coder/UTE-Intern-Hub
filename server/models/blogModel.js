import mongoose, { Schema } from "mongoose";

// Định nghĩa Blog Schema
const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        recruiter: { type: Schema.Types.ObjectId, ref: "Recruiters", required: true }
    },
    { timestamps: true }
);

// Tạo Blog Model
const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
