import prisma from "../lib/prisma.js";

export const getWorkouts = async (req, res) => {
  const { userId } = req.query;
  try {
    const where = userId ? { userId: Number(userId) } : {};
    const workouts = await prisma.workout.findMany({
      where,
      include: { exercises: true },
      orderBy: { date: "desc" },
    });
    res.json({ success: true, data: workouts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createWorkout = async (req, res) => {
  const { title, userId, notes, exercises } = req.body;
  try {
    const workout = await prisma.workout.create({
      data: {
        title,
        userId: Number(userId),
        notes: notes || null,
        exercises: exercises?.length ? {
          create: exercises.map(e => ({
            name: e.name,
            sets: Number(e.sets),
            reps: Number(e.reps),
            weight: e.weight ? Number(e.weight) : null,
          })),
        } : undefined,
      },
      include: { exercises: true },
    });
    res.json({ success: true, data: workout });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getWorkoutById = async (req, res) => {
  try {
    const workout = await prisma.workout.findUnique({
      where: { id: Number(req.params.id) },
      include: { exercises: true },
    });
    if (!workout) return res.status(404).json({ success: false, message: "Workout not found" });
    res.json({ success: true, data: workout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    await prisma.workout.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, message: "Workout deleted" });
  } catch (error) {
    res.status(404).json({ success: false, message: "Workout not found" });
  }
};
