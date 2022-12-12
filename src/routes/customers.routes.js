import { Router } from "express";

import { findCustomers, createCustomer, updateCustomer, findCustomerById } from '../controllers/customers.controller.js'
import validateCustomer from "../middlewares/validateCustomer.middleware.js";

const router = Router();

router.get("/customers", findCustomers);
router.get("/customers/:id", findCustomerById);
router.put("/customers/:id", validateCustomer ,updateCustomer);
router.post("/customers", validateCustomer ,createCustomer);

export default router;