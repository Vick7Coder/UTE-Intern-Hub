import mongoose, { Schema } from "mongoose";

// Định nghĩa Insight Schema
const insightSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        admin: { type: Schema.Types.ObjectId, ref: "Admins", required: true }
    },
    { timestamps: true }
);

// Tạo Insight Model
const Insight = mongoose.model("Insight", insightSchema);

export default Insight;
