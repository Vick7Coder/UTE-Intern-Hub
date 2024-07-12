import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import nodemailer from "nodemailer";
import Admins from '../models/AdminModel.js';

dotenv.config();

const createToken = (id) => {

  return jwt.sign({ userId: id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )
}


// REGISTER ADMIN
export const adminRegister = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await Admins.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "An account exist with this email!" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const admin = new Admins({ name, email, password: hashedPassword });
    await admin.save();

    // const adminRegToken = createToken(admin._id);

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        accountType: admin.accountType
      },
      // token: adminRegToken
    });
  } catch (err) {
    next(err);
  }
};

// LOGIN ADMIN
export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const admin = await Admins.findOne({ email });
    if (!admin) {
      throw new Error("Invalid email");
    }

    const validPassword = bcrypt.compareSync(password, admin.password);
    if (!validPassword) {
      throw new Error("Invalid password");
    }

    const adminLogToken = createToken(admin._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        accountType: admin.accountType
      },
      token: adminLogToken
    });
  } catch (err) {
    next(err);
  }
};

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    //Find the user by email
    const user = await Admins.findOne({ email });

    //If user not found, send error message
    if (!user) {
      // return res.status(404).send({ message: "User not found" });
      throw new Error("User Not Found")
    }

    //Generated a unique JWT token for the user that contains the user's id
    const token = jwt.sign({ userId: user._id, userType: 'admin' }, process.env.JWT_SECRET, { expiresIn: "10m", });

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
        <a href="https://ute-intern-hub.vercel.app/admin/reset-password/${token}">${token}</a>
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

export const resetAdminPassword = async (req, res, next) => {
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
    const user = await Admins.findById(userId);
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

export const updateAdminProfile = async (req, res, next) => {

  const { name, contact, location, profileUrl, about } = req.body;

  try {

    const id = req.user.userId;  //jwt decoded

    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error(`No Admin with id: ${id}`);

    const updatedAdmin = {
      name,
      contact,
      location,
      profileUrl,
      about,
      _id: id,
    };

    const ad = await Admins.findByIdAndUpdate(id, updatedAdmin, {
      new: true,
    });


    res.status(200).json({
      success: true,
      message: "Admin Profile Updated Successfully",
      admin: ad
    });

  } catch (error) {
    console.log(error);
    next(error)
  }
};


export const getAdminProfile = async (req, res, next) => {

  try {
    const id = req.user.userId;

    const ad = await Admins.findById({ _id: id });

    if (!ad) {
      throw new Error("Admin Not Found")
    }

    res.status(200).json({
      success: true,
      data: ad,
    });

  } catch (error) {
    console.log(error);
    next(error)
  }
};


export const deleteAdmin = async (req, res, next) => {
  try {

    const { id } = req.params;

    await Admins.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully Deleted"
    })
  }

  catch (err) {
    next(err)
  }
}

//GET ALL COMPANIES
export const getAdmins = async (req, res, next) => {

  try {
    const { search, sort, location } = req.query;

    //conditons for searching filters
    const queryObject = {};

    if (search) {
      queryObject.name = { $regex: search, $options: "i" };
    }

    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    let queryResult = Admins.find(queryObject).select("-password");

    // SORTING
    if (sort === "Newest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "Oldest") {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "A-Z") {
      queryResult = queryResult.sort("-name");
    }
    if (sort === "Z-A") {
      queryResult = queryResult.sort("name");
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;


    // records count
    const total = await Admins.countDocuments(queryResult);
    const numOfPage = Math.ceil(total / limit);


    // show more admins
    queryResult = queryResult.limit(limit * page);

    const admins = await queryResult;

    res.status(200).json({
      success: true,
      total,
      admins: admins,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};



export const getAdminById = async (req, res, next) => {
  try {
      const { id } = req.params;

      const admin = await Admins.findById(id).select("-password");

      if (!admin) {
          return res.status(404).json({
              success: false,
              message: "Admin Not Found"
          });
      }

      res.status(200).json({
          success: true,
          data: {
              _id: admin._id,
              name: admin.name,
              email: admin.email,
              contact: admin.contact,
              location: admin.location,
              about: admin.about,
              profileUrl: admin.profileUrl
          },
      });

  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};