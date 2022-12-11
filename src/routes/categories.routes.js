import { Router } from "express";

import { findCategories, createCategory } from '../controllers/categories.controller.js'

const router = Router();

router.get("/categories", findCategories);
router.post("/categories", createCategory);

export default router;