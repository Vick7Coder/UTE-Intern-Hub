import mongoose, { Schema } from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: { type: Schema.Types.ObjectId, ref: "Recruiters" },

    jobTitle: { type: String },

    jobType: { type: String },

    location: { type: String },

    salary: { type: String },

    vacancies: { type: Number },

    experience: { type: String },

    detail: { description: { type: String }, requirements: { type: String } },

    applicants: [{ type: Schema.Types.ObjectId, ref: "Seekers" }],
  },
  { timestamps: true }
);

const Jobs = mongoose.model("Jobs", jobSchema);

export default Jobs;
