import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import nodemailer from "nodemailer";
import Recruiters from '../models/recruiterModel.js'

dotenv.config();

const createToken = (id) => {

  return jwt.sign({ userId: id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )
}


export const recruiterRegister = async (req, res, next) => {

  const { companyName, email, password } = req.body;

  try {

    const userExists = await Recruiters.findOne({ email });

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


    const recruiter = new Recruiters({
      name: companyName, email, password: hashedPass, accountType: 'company'
    })

    await recruiter.save();

    const recruiterRegToken = createToken(recruiter._id);

    res.status(200).json({
      success: true,
      message: "Account Created Succcessfully",

      user: {
        id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        accountType: recruiter.accountType
      },
      token: recruiterRegToken
    })

  }
  catch (err) {

    next(err)  //passing the error to the error handler middlware which we created
  }

}

export const recruiterLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {

    const recruiter = await Recruiters.findOne({ email });

    if (!recruiter) {
      throw new Error("Enter a valid Email")
    }

    const validPass = bcrypt.compareSync(password, recruiter.password); //synchronous

    if (!validPass) {
      throw new Error("Invalid Password")
    }


    const recruiterLogToken = createToken(recruiter._id);

    res.status(200).json({
      success: true,
      message: "Logined Successfully",
      user: {
        id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        accountType: recruiter.accountType
      },
      token: recruiterLogToken
    })


  }
  catch (err) {
    next(err)
  }
}


export const updateCompanyProfile = async (req, res, next) => {

  const { name, contact, location, profileUrl, about } = req.body;

  try {

    const id = req.user.userId;  //jwt decoded

    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error(`No Company with id: ${id}`);

    const updatedCompany = {
      name,
      contact,
      location,
      profileUrl,
      about,
      _id: id,
    };

    const company = await Recruiters.findByIdAndUpdate(id, updatedCompany, {
      new: true,
    });


    res.status(200).json({
      success: true,
      message: "Company Profile Updated SUccessfully",
      company: company
    });

  } catch (error) {
    console.log(error);
    next(error)
  }
};


export const getCompanyProfile = async (req, res, next) => {

  try {
    const id = req.user.userId;

    const company = await Recruiters.findById({ _id: id });

    if (!company) {
      throw new Error("Company Not Found")
    }

    res.status(200).json({
      success: true,
      data: company,
    });

  } catch (error) {
    console.log(error);
    next(error)
  }
};



//GET ALL COMPANIES
export const getCompanies = async (req, res, next) => {

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

    let queryResult = Recruiters.find(queryObject).select("-password");

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
    const total = await Recruiters.countDocuments(queryResult);
    const numOfPage = Math.ceil(total / limit);


    // show more companies
    queryResult = queryResult.limit(limit * page);

    const companies = await queryResult;

    res.status(200).json({
      success: true,
      total,
      companies: companies,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

//GET  COMPANY JOBS
export const getCompanyJobListing = async (req, res, next) => {

  const { search, sort } = req.query;
  const id = req.user.userId;

  try {
    //conditons for searching filters
    const queryObject = {};

    if (search) {
      queryObject.location = { $regex: search, $options: "i" };
    }

    let sorting;
    //sorting || another way
    if (sort === "Newest") {
      sorting = "-createdAt";
    }
    if (sort === "Oldest") {
      sorting = "createdAt";
    }
    if (sort === "A-Z") {
      sorting = "name";
    }
    if (sort === "Z-A") {
      sorting = "-name";
    }

    let queryResult = await Recruiters.findById({ _id: id }).populate({
      path: "jobPosts",
      options: { sort: sorting },
    });
    const companies = await queryResult;

    res.status(200).json({
      success: true,
      companies: companies,
    });

  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// GET SINGLE COMPANY by id
export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await Recruiters.findById({ _id: id }).populate({
      path: "jobPosts",
      options: {
        sort: "-_id",
      },
    });

    if (!company) {
      throw new Error("Company Not Found")
    }



    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.log(error);
    next(error)
  }
};

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    //Find the user by email
    const user = await Recruiters.findOne({ email });

    //If user not found, send error message
    if (!user) {
      // return res.status(404).send({ message: "User not found" });
      throw new Error("User Not Found")
    }

    //Generated a unique JWT token for the user that contains the user's id
    const token = jwt.sign({ userId: user._id, userType: 'companies' }, process.env.JWT_SECRET, { expiresIn: "10m", });

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
      <a href="http://localhost:5173/companies/reset-password/${token}">${token}</a>
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


export const resetRecruiterPassword = async (req, res, next) => {
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
    const user = await Recruiters.findById(userId);
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
