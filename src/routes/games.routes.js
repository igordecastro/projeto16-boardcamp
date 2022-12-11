import { Router } from "express";
import validateGame from '../models/validateGame.middleware.js';
import { findGames, createGame } from '../controllers/games.controller.js'

const router = Router();

router.get("/games", findGames);
router.post("/games", validateGame, createGame);

export default router;