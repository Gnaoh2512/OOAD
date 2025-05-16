import { register, findUserByEmail, findUserById } from "../models/authModels.js";
import { hashPassword, comparePassword, generateToken } from "../middlewares/auth.js";

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export async function registerController(req, res) {
  const { name, email, password: passwordd } = req.body;

  try {
    if (!email || !passwordd || !name) return res.status(400).json({ message: "Missing fields" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const hashedPassword = await hashPassword(passwordd);

    await register(email, name, hashedPassword);

    const user = await findUserByEmail(email);

    const token = generateToken({ id: user.id });

    res.cookie("jwt", token, getCookieOptions());

    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function loginController(req, res) {
  const { email, password: passwordd } = req.body;

  try {
    if (!email || !passwordd) return res.status(400).json({ message: "Missing credentials" });

    const user = await findUserByEmail(email);

    if (!user || !(await comparePassword(passwordd, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user.id });

    res.cookie("jwt", token, getCookieOptions());

    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export function logoutController(req, res) {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json();
  } catch (err) {
    return res.status(500).json();
  }
}

export async function profileController(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(200).json({ message: "Unauthorized" });
    }

    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;

    return res.status(200).json(userWithoutPassword);
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
}
