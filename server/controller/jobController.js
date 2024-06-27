import mongoose from "mongoose";
import Jobs from "../models/jobModel.js";
import Recruiters from "../models/recruiterModel.js";

export const createJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      description,
      requirements,
    } = req.body;

    const id = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`No Company with id: ${id}`);
    }

    const jobPost = {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      detail: { description, requirements },
      company: id, //to know which company posted the job
    };

    const job = new Jobs(jobPost);
    await job.save();

    //update the company information with job id

    const company = await Recruiters.findById(id);

    company.jobPosts.push(job._id); // pusing the job id into the array.

    await Recruiters.findByIdAndUpdate(id, company, {
      new: true,
    }); // then an updation of the company

    res.status(200).json({
      success: true,
      message: "Job Posted SUccessfully",
      job,
    });
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      description,
      requirements,
    } = req.body;

    const id = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`No Company with id: ${id}`);
    }

    const { jobId } = req.params;

    const updatedPost = {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      detail: { description, requirements },
      _id: jobId,
    };

    await Jobs.findByIdAndUpdate(jobId, updatedPost, { new: true });

    res.status(200).json({
      success: true,
      message: "Job Post Updated SUccessfully",
      updatedPost,
    });
  } catch (err) {
    next(err);
  }
};


export const getJobPosts = async (req, res, next) => {
  try {
    const { search, sort, location, jtype, exp } = req.query;

    const types = jtype?.split(",");

    const experiences = exp.split(",");


    let queryObject = {};

    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    if (jtype) {
      queryObject.jobType = { $in: types };
    }

    if (exp) {

      queryObject.experience = {
        $in: experiences.map(expValue => new RegExp(`^${expValue}`))

      }
    }


    if (search) {
      const searchQuery = {
        $or: [
          { jobTitle: { $regex: search, $options: "i" } },
          { jobType: { $regex: search, $options: "i" } },
        ],
      };
      queryObject = { ...queryObject, ...searchQuery };
    }

    let queryResult = Jobs.find(queryObject).populate({
      path: "company",
      select: "-password", //minus is used to avoid password
    });

    // SORTING
    if (sort === "Newest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "Oldest") {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "A-Z") {
      queryResult = queryResult.sort("jobTitle");
    }
    if (sort === "Z-A") {
      queryResult = queryResult.sort("-jobTitle");
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;


    //records count
    const totalJobs = await Jobs.countDocuments(queryResult);
    const numOfPage = Math.ceil(totalJobs / limit);

    // show more jobs
    queryResult = queryResult.limit(limit * page);

    const jobs = await queryResult;

    res.status(200).json({
      success: true,
      totalJobs,
      data: jobs,
      page,
      numOfPage,
    });
  } catch (err) {
    next(err);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findById({ _id: id }).populate({
      path: "company",
      select: "-password",
    });

    if (!job) {
      throw new Error("No Job Found");
    }

    //GET SIMILAR JOB POST
    const searchQuery = {
      $or: [
        { jobTitle: { $regex: job.jobTitle, $options: "i" } },
        { jobType: { $regex: job.jobType, $options: "i" } },
      ],
    };

    let queryResult = Jobs.find(searchQuery)
      .populate({
        path: "company",
        select: "-password",
      })
      .sort({ _id: -1 });

    const similarJobs = await queryResult;

    res.status(200).json({
      success: true,
      data: job,
      similarJobs,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteJobPost = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    await Jobs.findByIdAndDelete(jobId);

    //updating the jobPosts

    const id = req.user.userId;

    const company = await Recruiters.findById(id);

    const indexToRemove = company.jobPosts.indexOf(jobId);

    company.jobPosts.splice(indexToRemove, 1); // deleting the delted job post from the array.

    await Recruiters.findByIdAndUpdate(id, company, {
      new: true,
    }); // then an updation of the company

    res.status(200).json({
      success: true,
      messsage: "Job Post Delted Successfully.",
    });
  } catch (err) {
    next(err);
  }
};
