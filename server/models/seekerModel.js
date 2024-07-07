import mongoose, { Schema } from "mongoose";

let seekerSchema = new mongoose.Schema({

    name: String,

    email: {
        type: String,
        unique: true,
    },
    password: String,

    accountType: {
        type: String,
        default: "seeker"
    },
    contact: { type: String },
    location: { type: String },
    profileUrl: { type: String },
    resumeUrl: { type: String },
    headLine: { type: String },
    about: { type: String },
    review: {
        type: String,
        default: "N/A"
    },
    reportUrl: { type: String },
    status: {
        type: String
    },
    providerId: {
        type: Schema.Types.ObjectId,
        ref: "recruiter"
    },
    // them de hien thi danh sach job da apply seeker
    appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'Jobs' }],

},
    { timestamps: true }
)

const Seekers = mongoose.model("Seekers", seekerSchema)

export default Seekers;
