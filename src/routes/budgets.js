import express from 'express';
import { BudgetController } from '../controllers/budgetController';

const router = express.Router();
const budgetController = new BudgetController();

// Route to create a new budget
router.post('/', budgetController.createBudget);

// Route to get all budgets
router.get('/', budgetController.getBudgets);

// Route to get a specific budget by ID
router.get('/:id', budgetController.getBudgetById);

// Route to update a budget by ID
router.put('/:id', budgetController.updateBudget);

// Route to delete a budget by ID
router.delete('/:id', budgetController.deleteBudget);

export default router;