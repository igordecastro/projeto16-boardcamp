import { Router } from "express";

import { findCustomers, createCustomer } from '../controllers/customers.controller.js'
import validateCustomer from "../models/validateCustomer.middleware.js";

const router = Router();

router.get("/customer", findCustomers);
router.post("/customer", validateCustomer ,createCustomer);

export default router;