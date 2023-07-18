const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const JWT = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { name, email, phone, password, question, address } = req.body;
    //validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone No. is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!address) {
      return res.send({ error: "address is required" });
    }
    if (!question) {
      return res.send({ error: "Security question is required" });
    }

    //existing user check
    const existinguser = await userModel.findOne({ email });
    if (existinguser) {
      res.status(200).send({
        success: false,
        message: "Already registerd please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
      question,
      address,
    }).save();
    res.status(201).send({
      success: true,
      message: "Register Successfull",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    //check user is present or not
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    //comparing password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfull",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

//forgot password controller
const forgotPasswordController = async (req, res) => {
  try {
    const { email, question, newPassword } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!question) {
      return res.status(400).send({ message: "Question is required" });
    }
    if (!newPassword) {
      return res.status(400).send({ message: "Password is required" });
    }
    //find user
    const user = await userModel.findOne({ email, question });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    return res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Forgot-Password",
      error,
    });
  }
};

//testcontroller
const testController = (req, res) => {
  res.send("Protected Route");
};

//update profile controller
const updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;
    if (password && password.length < 6) {
      return res.json({
        error: "password is required and minlength should be 6",
      });
    }

    //check user is present or not
    const existing_user = await userModel.findOne({ email });
    const hashed = password ? await hashPassword(password) : existing_user.password;
    const user = await userModel.findByIdAndUpdate(
      existing_user._id,
      {
        password: hashed,
        name: name || existing_user.name,
        address: address || existing_user.address,
        phone: phone || existing_user.phone,
      },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Profile updated Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Updating Data",
      error,
    });
  }
};
module.exports = {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
};