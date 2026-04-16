import express from "express";
import { getExercises, createExercise, deleteExercise } from "../controllers/exercises.js";

const router = express.Router();

router.get("/", getExercises);
router.post("/", createExercise);
router.delete("/:id", deleteExercise);

export default router;
