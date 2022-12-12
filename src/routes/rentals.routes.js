import { Router } from "express";
import { createRental, findRental } from "../controllers/rentals.controller.js";
import validateRental from "../middlewares/validateRentals.middleware.js";

const router = Router();

router.get("/rentals", findRental)
router.post("/rentals", validateRental, createRental)

export default router;