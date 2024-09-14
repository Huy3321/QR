import jwt from "jsonwebtoken";
import "dotenv/config";
import db from '../models';
import { hashPassWord, passwordMatch } from "./commonService.js";

const User = db.User;

const access_token = (user) => {
  return jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_ExpiresIn,
  });
};

const refresh_token = (user) => {
  return jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_ExpiresIn,
  });
};
const register = async (req) => {
  const { email } = req.body;
  const existEmail = await User.findOne({
    where: { email },
  });
  if (existEmail) {
    const error = new Error(
      "Email already exists in the system. Please use a different email address."
    );
    error.code = 400;
    throw error;
  }
  try {
    const createUser = req.body;
    createUser.password = hashPassWord(req.body.password);
    const newUser = await User.create(createUser);
    return newUser;
  } catch (err) {
    const error = new Error("Can't create new user!!!");
    error.code = 400;
    throw error;
  }
};


const login = async (req) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      const error = new Error(
        "User does not exist. Check your email again or register now!!"
      );
      error.code = 400;
      throw error;
    }
    const presentPassWord = passwordMatch(password, user.password);
    if (!presentPassWord) {
      const error = new Error("Password is wrong!! please try again");
      error.code = 400;
      throw error;
    }
    return {
      accessToken: access_token(user),
      refreshToken: refresh_token(user),
    };
    // return user
  } catch (err) {
    const error = new Error("Login failed !! Try again!!!");
    error.code = 400;
    throw error;
  }
};


const createNewToken = async(req) => { 
  const {id} = req.user
  const  user = await User.findOne({
    where:{id}
  });
  if(!user) {
    const error = new Error("User does not exist!!!!!!!!");
    error.code = 400;
    throw error;
  }
  return {
    accessToken: access_token(user),
    refreshToken: refresh_token(user),
  };
}

export {register,login,createNewToken}
  

