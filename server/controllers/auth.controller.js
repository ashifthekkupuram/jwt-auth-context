import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

import User from "../models/user.model.js";

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const USERNAME_REGEX = /^[a-z0-9_]{4,25}$/g;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g;

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please Provide the Credentials",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Wrong Credentials",
    });
  }

  const match = bcrypt.compareSync(password, user.password);

  if (!match) {
    return res.status(400).json({
      success: false,
      message: "Wrong Credentials",
    });
  } else {
    jwt.sign(
      {
        _id: user._id,
        email: user.email,
        username: user.username,
        profile: user.profile,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: "Something went wrong",
            error: err,
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            data: jwt.decode(token, process.env.SECRET_KEY),
          });
        }
      }
    );
  }
};

export const register = async (req, res, next) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide credentials",
    });
  }

  const [emailExist, usernameExist] = await Promise.all([
    User.exists({ email }),
    User.exists({ username }),
  ]);

  if (emailExist) {
    return res.status(400).json({
      success: false,
      message: "Account with the Email already exist",
    });
  }

  if (usernameExist) {
    return res.status(400).json({
      success: false,
      message: "Account with the username already exist",
    });
  }

  if (!email.match(EMAIL_REGEX)) {
    return res.status(400).json({
      success: false,
      message: "Not a valid Email",
    });
  }

  if (!username.match(USERNAME_REGEX)) {
    return res.status(400).json({
      success: false,
      message: "Not a valid Username",
    });
  }

  if (!password.match(PASSWORD_REGEX)) {
    return res.status(400).json({
      success: false,
      message: "Not a valid Password",
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = new User({
    email,
    username,
    password: hashedPassword,
  });

  try {
    await user.save();
    return res.status(200).json({
      success: true,
      message: "User has been created",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: err,
    });
  }
};

export const verify = (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Please provide credentials",
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid Token",
        error: err,
      });
    } else {
      const user = await User.findById(data._id);
      return res.status(200).json({
        success: true,
        message: "Valid Token",
        data: {
          _id: user._id,
          email: user.email,
          username: user.username,
          profile: user.profile,
        },
      });
    }
  });
};
