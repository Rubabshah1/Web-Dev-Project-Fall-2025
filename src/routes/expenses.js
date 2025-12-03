// import express from 'express';
// import { ExpenseController } from '../controllers/expenseController';

// const router = express.Router();
// const expenseController = new ExpenseController();

// // Route to get all expenses
// router.get('/', expenseController.getAllExpenses.bind(expenseController));

// // Route to get a specific expense by ID
// router.get('/:id', expenseController.getExpenseById.bind(expenseController));

// // Route to create a new expense
// router.post('/', expenseController.createExpense.bind(expenseController));

// // Route to update an existing expense by ID
// router.put('/:id', expenseController.updateExpense.bind(expenseController));

// // Route to delete an expense by ID
// router.delete('/:id', expenseController.deleteExpense.bind(expenseController));

// export default router;
import express from 'express';
import { getExpenses, createExpense, deleteExpense } from '../controllers/expenseController.js';

const router = express.Router();

router.get('/', getExpenses);
router.post('/', createExpense);
router.delete('/:expenseId', deleteExpense);

export default router;