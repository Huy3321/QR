import db from '../models';

const User = db.User;
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
    console.log(222222,err)
    const error = new Error("Can't create new user!!!");
    error.code = 400;
    throw error;
  }
};


const getUsers = async (req) => {
  try {
    const users = await User.findAll(req.body);
    return users;
  } catch (error) {
    throw new Error(error);
  }
};
export {getUsers };
