import express from 'express';
import { getBudgets, createBudget } from '../controllers/budgetController.js';

const router = express.Router();

// Route to get all budgets
router.get('/', getBudgets);

// Route to create a new budget
router.post('/', createBudget);

export default router;