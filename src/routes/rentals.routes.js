import { Router } from "express";
import { createRental, deleteRental, findRental, finishRental } from "../controllers/rentals.controller.js";
import validateRental from "../middlewares/validateRentals.middleware.js";

const router = Router();

router.get("/rentals", findRental)
router.post("/rentals", validateRental, createRental)
router.post("/rentals/:id/return", finishRental)
router.delete("/rentals/:id", deleteRental)

export default router;