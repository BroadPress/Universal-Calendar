const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/userModel");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
const verifyCaptcha = require("../utils/verifyCaptcha");


const signup = async (req, res) => {
  try {
    const { name, email, password, captchaToken } = req.body;

    // ✅ Check all fields
    if (!name || !email || !password || !captchaToken) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Verify reCAPTCHA
    const captchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecret}&response=${captchaToken}`;
    const { data } = await axios.post(verifyURL);

    if (!data.success) {
      return res.status(400).json({ message: "CAPTCHA verification failed" });
    }

    // ✅ Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      username: name, // match frontend 'name'
      email,
      password: hashedPassword,
    });

    // ✅ Set token cookie
    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const login = async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;

    // Verify captcha first
    const isCaptchaValid = await verifyCaptcha(captchaToken);
    if (!isCaptchaValid) {
      return res.status(400).json({ message: "Captcha verification failed" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ authenticated: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(401).json({ authenticated: false });

    res.json({ authenticated: true, user });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
};

module.exports = { signup, login, logout, checkAuth };