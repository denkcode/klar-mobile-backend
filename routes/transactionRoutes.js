import { Router } from "express";
import { createTransaction, deleteTransaction, getAllTransaction, getSummary, getTransactionById, updateTransaction } from "../controllers/transaction.controller.js";
import { celebrate } from 'celebrate';
const router = Router();
import { createTransactionShema, getAllTransactionSchema } from "../validations/validationsTransaction.js";
import { authenticate } from "../middlewares/authenticate.js";

router.get('/', authenticate, celebrate(getAllTransactionSchema), getAllTransaction)
router.get('/summary', authenticate, getSummary)
router.get('/:transactionId', authenticate, getTransactionById)
router.post('/', authenticate, celebrate(createTransactionShema), createTransaction)
router.delete('/:transactionId', authenticate, deleteTransaction)
router.patch('/:transactionId', authenticate, celebrate(createTransactionShema), updateTransaction)

export default router