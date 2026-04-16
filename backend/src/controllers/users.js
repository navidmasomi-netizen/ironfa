import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

const sanitizeUser = ({ password, ...user }) => user;

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ success: true, data: users.map(sanitizeUser) });
};

export const createUser = async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });
    res.json({ success: true, data: sanitizeUser(user) });
  } catch (error) {
    res.status(400).json({ success: false, message: "Email already exists" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  if (!user.password) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  res.json({ success: true, data: sanitizeUser(user) });
};

export const getUserById = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, data: sanitizeUser(user) });
};
