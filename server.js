// server.js  ← put this in your project root (same level as package.json)
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

// Correct paths — your files are directly in /routes and /controllers
import authRouter from './src/routes/auth.js';
import budgetsRouter from './src/routes/budgets.js';
import expensesRouter from './src/routes/expenses.js';
import categoriesRouter from './src/routes/categories.js';

const app = express();
const PORT = 5001;

// Fixed CORS for Vite
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/categories', categoriesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running perfectly', time: new Date() });
});

app.listen(PORT, () => {
  console.log('Backend is LIVE on http://localhost:5001');
});
// // // import express from 'express';
// // // import { createClient } from '@supabase/supabase-js';
// // // import budgetsRoutes from './src/routes/budgets';
// // // import expensesRoutes from './src/routes/expenses';
// // // import categoriesRoutes from './src/routes/categories';

// // // const app = express();
// // // const PORT = process.env.PORT || 5000;

// // // // Initialize Supabase client
// // // const supabaseUrl = process.env.SUPABASE_URL;
// // // const supabaseKey = process.env.SUPABASE_KEY;
// // // const supabase = createClient(supabaseUrl, supabaseKey);

// // // // Middleware
// // // app.use(express.json());

// // // // Routes
// // // app.use('/api/auth', authRouter);
// // // app.use('/api/budgets', budgetsRoutes);
// // // app.use('/api/expenses', expensesRoutes);
// // // app.use('/api/categories', categoriesRoutes);

// // // // Start server
// // // app.listen(PORT, () => {
// // //   console.log(`Server is running on http://localhost:${PORT}`);
// // // });
// // import dotenv from 'dotenv';
// // import path from 'path';
// // import { fileURLToPath } from 'url';

// // // Get current directory
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // // Load environment variables FIRST - before any other imports
// // dotenv.config({ path: path.join(__dirname, '.env') });

// // // Log to verify env vars are loaded
// // console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'loaded' : 'NOT FOUND');
// // console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'loaded' : 'NOT FOUND');

// // // NOW import everything else
// // import express from 'express';
// // import cors from 'cors';
// // import authRouter from './src/routes/auth.js';
// // import budgetsRouter from './src/routes/budgets.js';
// // import expensesRouter from './src/routes/expenses.js';
// // import categoriesRouter from './src/routes/categories.js';

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // // Middleware
// // app.use(cors({
// //   origin: 'http://localhost:5173',
// //   credentials: true
// // }));
// // app.use(express.json());

// // // Routes
// // app.use('/api/auth', authRouter);
// // app.use('/api/budgets', budgetsRouter);
// // app.use('/api/expenses', expensesRouter);
// // app.use('/api/categories', categoriesRouter);

// // // Health check
// // app.get('/api/health', (req, res) => {
// //   res.json({ status: 'Server is running' });
// // });

// // // Error handling middleware
// // app.use((err, req, res, next) => {
// //   console.error('Error:', err);
// //   res.status(500).json({ 
// //     success: false, 
// //     error: err.message || 'Internal server error' 
// //   });
// // });

// // // Start server
// // app.listen(PORT, () => {
// //   console.log(`Server is running on http://localhost:${PORT}`);
// // });
// import dotenv from 'dotenv';
// dotenv.config(); 
// import path from 'path';
// import { fileURLToPath } from 'url';
// import express from 'express';
// import cors from 'cors';
// import authRouter from './src/routes/auth.js';
// import budgetsRouter from './src/routes/budgets.js';
// import expensesRouter from './src/routes/expenses.js';
// import categoriesRouter from './src/routes/categories.js';  

// // Get current directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load environment variables from .env file
// dotenv.config({ path: path.join(__dirname, '.env') });

// // Log to verify env vars are loaded (remove after debugging)
// console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'loaded' : 'NOT FOUND');
// console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'loaded' : 'NOT FOUND');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:8080',
//   credentials: true
// }));
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRouter);
// app.use('/api/budgets', budgetsRouter);
// app.use('/api/expenses', expensesRouter);
// app.use('/api/categories', categoriesRouter);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'Server is running' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).json({ 
//     success: false, 
//     error: err.message || 'Internal server error' 
//   });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });