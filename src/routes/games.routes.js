import { Router } from "express";
import validateGame from '../middlewares/validateGame.middleware.js';
import { findGames, createGame } from '../controllers/games.controller.js'

const router = Router();

router.get("/games", findGames);
router.post("/games", validateGame, createGame);

export default router;