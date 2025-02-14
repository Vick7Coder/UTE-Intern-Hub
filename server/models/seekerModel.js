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
    stuId: { type: String },
    contact: { type: String },
    location: { type: String },
    profileUrl: { type: String },
    resumeUrl: { type: String },
    headLine: { type: String },
    about: { type: String },
    review: {
        type: String
    },
    reportUrl: { type: String },
    status: {
        type: String
    },
    providerId: {
        type: Schema.Types.ObjectId,
        ref: "recruiter"
    },
    appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'Jobs' }],
    acceptedJob: {
        type: Schema.Types.ObjectId,
        ref: 'Jobs',
        default: null
    },
    isAssignedToLecturer: {
        type: Boolean,
        default: false
    },

},
    { timestamps: true }
)

const Seekers = mongoose.model("Seekers", seekerSchema)

export default Seekers;
