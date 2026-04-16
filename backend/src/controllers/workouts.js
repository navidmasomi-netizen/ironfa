import prisma from "../lib/prisma.js";

export const getWorkouts = async (req, res) => {
  const workouts = await prisma.workout.findMany({
    include: { exercises: true },
  });
  res.json({ success: true, data: workouts });
};

export const createWorkout = async (req, res) => {
  const { title, userId } = req.body;
  try {
    const workout = await prisma.workout.create({
      data: { title, userId: Number(userId) },
    });
    res.json({ success: true, data: workout });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getWorkoutById = async (req, res) => {
  const workout = await prisma.workout.findUnique({
    where: { id: Number(req.params.id) },
    include: { exercises: true },
  });
  if (!workout) return res.status(404).json({ success: false, message: "Workout not found" });
  res.json({ success: true, data: workout });
};

export const deleteWorkout = async (req, res) => {
  try {
    await prisma.workout.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ success: true, message: "Workout deleted" });
  } catch (error) {
    res.status(404).json({ success: false, message: "Workout not found" });
  }
};
