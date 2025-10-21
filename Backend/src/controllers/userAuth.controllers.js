import User from "../models/user.model.js";
import { userValidator } from "../utils/validators.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    
    //1. validate req.body
    userValidator(req.body);
    const { firstName, emailId, password } = req.body;

    //2. password hashing
    req.body.password = await bcrypt.hash(password, 10);

    //3. check for already existing user => NO since - required = true
    await User.create(req.body);

    //4. JWT-authentication => send token in cookies
    const token = jwt.sign({ emailId }, process.env.JWT_SECRET_KEY, {
      expiresIn: 60 * 60,
    })
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60
    })

    //5. send the responce
    res.status(201).send("User created Successfully")

  } catch (err) {
    res.status(401).send("Error : ", err)
  }
}

export const login = async (req, res) => {};

export const logout = async (req, res) => {};

export const getProfile = async (req, res) => {};
