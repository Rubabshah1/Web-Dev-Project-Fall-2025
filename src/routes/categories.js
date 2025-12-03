// import express from 'express';
// import { CategoryController } from '../controllers/categoryController';

// const router = express.Router();
// const categoryController = new CategoryController();

// // Route to get all categories
// router.get('/', categoryController.getAllCategories.bind(categoryController));

// // Route to get a category by ID
// router.get('/:id', categoryController.getCategoryById.bind(categoryController));

// // Route to create a new category
// router.post('/', categoryController.createCategory.bind(categoryController));

// // Route to update a category by ID
// router.put('/:id', categoryController.updateCategory.bind(categoryController));

// // Route to delete a category by ID
// router.delete('/:id', categoryController.deleteCategory.bind(categoryController));

// export default router;
import express from 'express';
import categoryController from '../controllers/categoryController.js';

const router = express.Router();

// Get all categories
router.get('/', categoryController.getCategories.bind(categoryController));

// Create a new category
router.post('/', categoryController.addCategory.bind(categoryController));

export default router;