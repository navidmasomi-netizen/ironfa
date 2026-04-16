import prisma from "../lib/prisma.js";

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ success: true, data: users });
};

export const createUser = async (req, res) => {
  const { email, name } = req.body;
  try {
    const user = await prisma.user.create({
      data: { email, name },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: "Email already exists" });
  }
};

export const getUserById = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, data: user });
};
