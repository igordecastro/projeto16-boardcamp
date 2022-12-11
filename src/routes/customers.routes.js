import { Router } from "express";

import { findCustomers, createCustomer, findCustomerById } from '../controllers/customers.controller.js'
import validateCustomer from "../models/validateCustomer.middleware.js";

const router = Router();

router.get("/customers", findCustomers);
router.get("/customers/:id", findCustomerById);
router.post("/customers", validateCustomer ,createCustomer);

export default router;