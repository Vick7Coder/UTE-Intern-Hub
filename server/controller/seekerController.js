import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
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
      throw new Error("Email Already Exists")
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