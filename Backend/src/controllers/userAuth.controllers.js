import Submission from "../models/submission.model.js";
import User from "../models/user.model.js";
import { loginValidator, userValidator } from "../utils/validators.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/api-responce.js";

export const register = async (req, res) => {
  try {
    //1. validate req.body
    const { firstName, emailId, password } = req.body;
    userValidator(req.body);

    //2. password hashing
    req.body.password = await bcrypt.hash(password, 10);

    // make sure user is not admin from this route
    req.body.role = "user";

    //3. check for already existing user => NO since - required = true
    const user = await User.create(req.body);

    //4. JWT-authentication => send token in cookies
    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: "user" },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: 60 * 60,
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60,
    });

    //5. send the responce
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { user: { id: user._id, email: user.emailId, role: user.role } },
          "User registered successfully"
        )
      );
  } catch (err) {
    res.status(401).json(new ApiResponse(401, null, err.message));
  }
};

export const adminRegister = async (req, res) => {
  try {
    //1. validate req.body
    const { firstName, emailId, password } = req.body;
    userValidator(req.body);

    //2. password hashing
    req.body.password = await bcrypt.hash(password, 10);

    // make sure user is not admin from this route
    req.body.role = "admin";

    //3. check for already existing user => NO since - required = true
    const user = await User.create(req.body);

    //4. JWT-authentication => send token in cookies
    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: "admin" },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: 60 * 60,
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60,
    });

    //5. send the responce
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { user: { id: user._id, email: user.emailId, role: user.role } },
          "Admin registered successfully"
        )
      );
  } catch (err) {
    res.status(400).json(new ApiResponse(400, null, err.message));
  }
};

export const login = async (req, res) => {
  try {
    // 1. validate the req.body
    const { emailId, password } = req.body;
    loginValidator(req.body);

    // 2. find the user
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("User not found");
    }

    // 3. match the password
    const isValidPassord = bcrypt.compare(password, user.password);
    if (!isValidPassord) {
      throw new Error("Invalid Credentials...");
    }

    // 4. send JWT token to browser
    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: 60 * 60,
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60, //millisec
    });

    // 5. send the responce
    res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            email: user.emailId,
            role: user.role,
          },
        },
        "Login successful"
      )
    );
  } catch (error) {
    res.status(401).json(new ApiResponse(401, null, error.message));
  }
};

export const logout = async (req, res) => {
  try {
    //1. Clear the JWT token cookie
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // This will make the cookie expire immediately
    });

    res.status(200).json(new ApiResponse(200, null, "Logout successful"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, "Error during logout"));
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.result._id;

    // delete from userSchema
    await User.findByIdAndDelete(userId);

    // delete from ssubmission table too
    await Submission.deleteMany({ userId });

    res
      .status(200)
      .json(new ApiResponse(200, null, "Profile deleted successfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getProfile = async (req, res) => {};
