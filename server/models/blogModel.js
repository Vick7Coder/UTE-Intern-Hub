import mongoose, { Schema } from "mongoose";

const BlogSchema = new mongoose.Schema(
    {

        BlogTitle: { type: String },
        ContentBlog: { description: { type: String }, requirements: { type: String } },
    },
    { timestamps: true }
);

const Blogs = mongoose.model("Blogs", BlogSchema);

export default Blogs;
