import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import nodemailer from "nodemailer";
import mongoose from 'mongoose'
import Seekers from '../models/seekerModel.js'
import Jobs from '../models/jobModel.js'
import Recruiters from '../models/recruiterModel.js';

dotenv.config();

const createToken = (id) => {

  return jwt.sign({ userId: id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )
}

export const seekerRegister = async (req, res, next) => {

  const { seekerName, email, password } = req.body;

  try {

    const userExists = await Seekers.findOne({ email });

    if (userExists) {
      throw new Error("Email registed before!");
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại"
      });
    }

    //password hasing (these are Synchronous)

    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, salt)

    const seeker = new Seekers({
      name: seekerName, email, password: hashedPass
    })

    await seeker.save();

    const seekerRegToken = createToken(seeker._id);

    res.status(200).json({
      success: true,
      message: "Account Created Succcessfully",
      user: {
        id: seeker._id,
        name: seeker.name,
        email: seeker.email,
        accountType: seeker.accountType
      },
      token: seekerRegToken
    })

  }
  catch (err) {

    next(err)  //passing the error to the error handler middlware which we created
  }

}

export const seekerLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {

    const seeker = await Seekers.findOne({ email });

    if (!seeker) {
      throw new Error("Enter a valid Email")
    }

    const validPass = bcrypt.compareSync(password, seeker.password);

    if (!validPass) {
      throw new Error("Invalid Password")
    }

    const seekerLogToken = createToken(seeker._id);

    res.status(200).json({
      success: true,
      message: "Logined Successfully",
      user: {
        id: seeker._id,
        name: seeker.name,
        email: seeker.email,
        accountType: seeker.accountType
      },
      token: seekerLogToken
    })

  }
  catch (err) {
    next(err)
  }
}

export const updateUser = async (req, res, next) => {
  const {
    name,
    stuId,
    email,
    contact,
    location,
    profileUrl,
    resumeUrl,
    headLine,
    about,
  } = req.body;

  try {

    const id = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`No User with id: ${id}`);
    }

    const updatedUser = {
      name,
      stuId,
      email,
      contact,
      location,
      profileUrl,
      resumeUrl,
      headLine,
      about,
      _id: id,
    };

    const user = await Seekers.findByIdAndUpdate(id, updatedUser, { new: true });

    res.status(200).json({
      sucess: true,
      message: "User updated successfully",
      user: user
    });

  } catch (err) {
    console.log(err);
    next(err)
  }
};

// getting user info using decoded token id

export const getUser = async (req, res, next) => {
  try {

    const id = req.user.userId;

    const user = await Seekers.findById({ _id: id });

    if (!user) {
      throw new Error("User Not Found")
    }

    res.status(200).json({
      success: true,
      user: user,
    });

  }
  catch (err) {
    console.log(err);
    next(err)
  }
};

//getting user Data using id
export const getUserById = async (req, res, next) => {
  try {

    const { id } = req.params;

    const user = await Seekers.findById({ _id: id });

    if (!user) {
      throw new Error("User Not Found")
    }

    res.status(200).json({
      success: true,
      user: user,
    });

  }
  catch (err) {
    console.log(err);
    next(err)
  }
}

// Trong seekerController.js
export const applyJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.userId;

    const seeker = await Seekers.findById(userId);
    if (!seeker) {
      throw new Error("Seeker not found");
    }

    // Kiểm tra xem seeker đã được chấp nhận cho một công việc nào chưa
    if (seeker.acceptedJob) {
      return res.status(400).json({
        success: false,
        message: "You have already been accepted for a job and cannot apply to others.",
      });
    }

    // Tìm job và cập nhật
    const job = await Jobs.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    if (!job.applicants.includes(userId)) {
      job.applicants.push(userId);
      await job.save();
    }

    // Cập nhật seeker
    if (!seeker.appliedJobs.includes(jobId)) {
      seeker.appliedJobs.push(jobId);
      await seeker.save();
    }

    res.status(200).json({
      success: true,
      message: "Applied Successfully",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {

    const { id } = req.params;

    await Seekers.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully Deleted"
    })
  }

  catch (err) {
    next(err)
  }
}

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    //Find the user by email
    const user = await Seekers.findOne({ email });

    //If user not found, send error message
    if (!user) {
      // return res.status(404).send({ message: "User not found" });
      throw new Error("User Not Found")
    }

    //Generated a unique JWT token for the user that contains the user's id
    const token = jwt.sign({ userId: user._id, userType: 'user' }, process.env.JWT_SECRET, { expiresIn: "10m", });

    //send the token to the user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_APP_EMAIL,
      },
    });

    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
      <p>Click on the following link to reset your password:</p>
      <a href="http://localhost:5173/user/reset-password/${token}">Click here!</a>
      <p>The link will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      res.status(200).send({ message: "Email sent" });
    });

  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    // Verify the token sent by the user
    const decodedToken = jwt.verify(
      req.params.token,
      process.env.JWT_SECRET
    );
    // If the token is invalid, return an error
    if (!decodedToken) {
      return res.status(401).send({ message: "Invalid token" });
    }
    const { userId } = decodedToken;

    // find the user with the id from the token
    const user = await Seekers.findById({ _id: userId });
    if (!user) {
      return res.status(401).send({ message: "no user found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);

    // Update user's password, clear reset token and expiration time
    user.password = req.body.newPassword;
    await user.save();

    // Send success response
    res.status(200).send({ message: "Password updated" });
  } catch (error) {
    // Send error response if any error occurs
    next(error);
  }
};

// Trong seekerController.js
// Trong seekerController.js
export const getAppliedJobs = async (req, res, next) => {
  try {
    const userId = req.params.id;

    console.log("Fetching applied jobs for user:", userId);  // Thêm log này

    const seeker = await Seekers.findById(userId).populate('appliedJobs');

    if (!seeker) {
      console.log("User not found");  // Thêm log này
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("Applied jobs:", seeker.appliedJobs);  // Thêm log này

    res.status(200).json({
      success: true,
      appliedJobs: seeker.appliedJobs
    });
  } catch (error) {
    console.error("Error in getAppliedJobs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllSeekers = async (req, res, next) => {
  try {
    const { search, sort, location } = req.query;

    // conditions for searching filters
    const queryObject = {};

    if (search) {
      queryObject.name = { $regex: search, $options: "i" };
    }

    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    let queryResult = Seekers.find(queryObject).select("-password");

    // SORTING
    if (sort === "Newest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "Oldest") {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "A-Z") {
      queryResult = queryResult.sort("name");  // A-Z sorting
    }
    if (sort === "Z-A") {
      queryResult = queryResult.sort("-name");  // Z-A sorting
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    // records count
    const total = await Seekers.countDocuments(queryObject);
    const numOfPage = Math.ceil(total / limit);

    // apply pagination
    queryResult = queryResult.skip((page - 1) * limit).limit(limit);

    const seekers = await queryResult;

    res.status(200).json({
      success: true,
      total,
      seekers: seekers,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const uploadReportUrl = async (req, res, next) => {
  const { reportUrl } = req.body;

  try {
    const id = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`No User with id: ${id}`);
    }

    const updatedUser = await Seekers.findByIdAndUpdate(
      id,
      { reportUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Report URL uploaded successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const uploadReviewUrl = async (req, res, next) => {
  const { review, seekerId } = req.body;

  try {
    // Retrieve recruiter details based on userId
    const recruiter = await Recruiters.findById(req.user.userId);

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    // Check if the recruiter is a company
    if (recruiter.accountType !== 'company') {
      return res.status(403).json({
        success: false,
        message: "Only company users can upload reviews",
      });
    }

    if (!seekerId) {
      return res.status(400).json({
        success: false,
        message: "Seeker ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(seekerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Seeker ID",
      });
    }

    // Check if the seeker is accepted in any of the recruiter's jobs
    const jobWithAcceptedSeeker = await Jobs.findOne({
      company: recruiter._id,
      acceptedApplicants: seekerId
    });

    if (!jobWithAcceptedSeeker) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to review this seeker",
      });
    }

    // Update the seeker's review
    const updatedSeeker = await Seekers.findByIdAndUpdate(
      seekerId,
      { review },
      { new: true }
    );

    if (!updatedSeeker) {
      return res.status(404).json({
        success: false,
        message: "Seeker not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review uploaded successfully",
      user: updatedSeeker,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};