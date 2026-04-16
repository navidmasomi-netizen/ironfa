import prisma from "../lib/prisma.js";

export const getExercises = async (req, res) => {
  const exercises = await prisma.exercise.findMany();
  res.json({ success: true, data: exercises });
};

export const createExercise = async (req, res) => {
  const { name, sets, reps, weight, workoutId } = req.body;
  try {
    const exercise = await prisma.exercise.create({
      data: { name, sets: Number(sets), reps: Number(reps), weight: weight ? Number(weight) : null, workoutId: Number(workoutId) },
    });
    res.json({ success: true, data: exercise });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteExercise = async (req, res) => {
  try {
    await prisma.exercise.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ success: true, message: "Exercise deleted" });
  } catch (error) {
    res.status(404).json({ success: false, message: "Exercise not found" });
  }
};
