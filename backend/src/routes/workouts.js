import express from "express";
import { getWorkouts, createWorkout, getWorkoutById, deleteWorkout } from "../controllers/workouts.js";

const router = express.Router();

router.get("/", getWorkouts);
router.post("/", createWorkout);
router.get("/:id", getWorkoutById);
router.delete("/:id", deleteWorkout);

export default router;
