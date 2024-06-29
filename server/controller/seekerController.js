import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import nodemailer from "nodemailer";
import mongoose from 'mongoose'
import Seekers from '../models/seekerModel.js'
import Jobs from '../models/jobModel.js'

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

export const applyJob = async (req, res, next) => {

  try {

    const { jobId } = req.params;
    const id = req.user.userId

    //pushing the user id to the applicants array and updating the record
    const job = await Jobs.findById(jobId);

    job.applicants.push(id);

    await Jobs.findByIdAndUpdate(jobId, job, {
      new: true,
    });

    res.status(200).json({
      message: "Applied Successfully"
    })
  }

  catch (err) {
    console.log(err)
    next(err)
  }
}

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

export const forgetPassword = async (req, res) => {
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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET , { expiresIn: "10m", });

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
      <a href="http://localhost:5173/reset-password/${token}">http://localhost:5173/reset-password/${token}</a>
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
    res.status(500).send({ message: error.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    // Verify the token sent by the user
    const decodedToken = jwt.verify(
      req.params.token,
      process.env.JWT_SECRET_KEY
    );

    // If the token is invalid, return an error
    if (!decodedToken) {
      return res.status(401).send({ message: "Invalid token" });
    }

    // find the user with the id from the token
    const user = await User.findOne({ _id: decodedToken.userId });
    if (!user) {
      return res.status(401).send({ message: "no user found" });
    }

    // Hash the new password
    const salt = await bycrypt.genSalt(10);
    req.body.newPassword = await bycrypt.hash(req.body.newPassword, salt);

    // Update user's password, clear reset token and expiration time
    user.password = req.body.newPassword;
    await user.save();

    // Send success response
    res.status(200).send({ message: "Password updated" });
  } catch (error) {
    // Send error response if any error occurs
    res.status(500).send({ message: err.message });
  }
};