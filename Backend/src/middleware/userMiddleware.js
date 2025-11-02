import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/api-responce.js";

export const userMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Authentication required"));
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { _id } = payload;

    if (!_id) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid authentication token"));
    }

    const result = await User.findById(_id);
    if (!result) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    req.result = result;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(
        new ApiResponse(401, null, `Authentication error: ${error.message}`)
      );
  }
};
