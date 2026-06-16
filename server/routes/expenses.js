import express from 'express';
import { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense } from '../controllers/expenseController.js';
import { protect } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { expenseSchema } from '../utils/validationSchemas.js';

const router = express.Router();
router.use(protect);
router.post('/', validateBody(expenseSchema), createExpense);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.patch('/:id', updateExpense);
router.delete('/:id', deleteExpense);
export default router;
