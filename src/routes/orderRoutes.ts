import express from "express";
const router = express.Router();
import { getOrdersByClientLastSixMonths, getOrdersByDateRange, getOrdersLastSixMonths,getOrdersByClientByDateRange, getTotalOrdersByClientByDateRange } from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkedObjectId.js";

router.get('/date-range', getOrdersByDateRange);
router.get('/last-six-months', getOrdersLastSixMonths);
router.get('/last-six-months/:clientId', getOrdersByClientLastSixMonths);
router.get('/date-range/:clientId', getOrdersByClientByDateRange);
router.get('/total-orders/date-range/:clientId', getTotalOrdersByClientByDateRange);



export default router;
