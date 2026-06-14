import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { createSession, setSessionCookies } from "../services/auth.js";
import fs from "fs";
import { sendEmail } from '../utils/sendEmail.js'
import Handlebars from 'handlebars'
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
// Register User

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(400, "Email is already in use, try another one");
    }

    // Hashed Password

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    });
    const newSession = await createSession(user._id);
    setSessionCookies(res, newSession);
    res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

// Login User

export const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Invalid Email");
  }

  const isValidPaswword = await bcrypt.compare(password, user.password);
  if (!isValidPaswword) {
    throw createHttpError(401, "Invalid password");
  }

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);
  res.status(200).json(user);
};

export const getMe = async (req, res) => {
  return res.status(200).json(req.user);
};

export const logOut = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }
  res.clearCookie("sessionId");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(204).send();
};

export const refresh = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }
  const isRefreshTokenExpired = session.refreshTokenValidUntil < new Date();

  if (isRefreshTokenExpired) {
    await Session.deleteOne({ _id: sessionId });
    res.clearCookie("sessionId");
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw createHttpError(401, "Refresh token expired");
  }

  await Session.deleteOne({ _id: sessionId });
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);
  res.status(200).json({ message: "Session refreshed" });
};

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(200)
      .json({ message: "Password reset email send successfully" });
  }

  const resetToken = jwt.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatePath = path.join(__dirname, "../templates/reset-password.hbs");
  const templateSource = fs.readFileSync(templatePath, "utf-8");
  const template = Handlebars.compile(templateSource);
  console.log(user)
  const html = template({ name: user.username, resetLink });

  try {
    await sendEmail({
      from: process.env.BREVO_SENDER_EMAIL,
      to: email,
      subject: "Reset password",
      html: html,
    });
  } catch(error) {
    console.log(error); 
    throw createHttpError(500, "Failed reset email, please try again later");
  }
  console.log('after try/catch')
  res.status(200).json({ message: "Password reset email sent success" });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, "Invalid or expired token");
  }

  const user = await User.findOne({ _id: payload.sub, email: payload.email });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { password: hashedPassword });

  await Session.deleteMany({ userId: user._id });
  res.status(200).json({
    message: "Password reset successfully",
  });
};
