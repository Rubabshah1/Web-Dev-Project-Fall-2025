// // import { supabase } from '../integrations/supabaseClient.js';

// // class BudgetController {
// //   async getBudgets(req, res) {
// //     try {
// //       const { data, error } = await supabase
// //         .from('budgets')
// //         .select('*')
// //         .eq('user_id', req.user.id);

// //       if (error) throw error;

// //       res.status(200).json(data);
// //     } catch (error) {
// //       res.status(500).json({ error: error.message });
// //     }
// //   }

// //   async createBudget(req, res) {
// //     const { total_budget, period_start, period_end } = req.body;

// //     try {
// //       const { data, error } = await supabase
// //         .from('budgets')
// //         .insert([{ user_id: req.user.id, total_budget, period_start, period_end }]);

// //       if (error) throw error;

// //       res.status(201).json(data);
// //     } catch (error) {
// //       res.status(500).json({ error: error.message });
// //     }
// //   }

// //   async updateBudget(req, res) {
// //     const { id } = req.params;
// //     const { total_budget } = req.body;

// //     try {
// //       const { data, error } = await supabase
// //         .from('budgets')
// //         .update({ total_budget })
// //         .eq('id', id)
// //         .eq('user_id', req.user.id);

// //       if (error) throw error;

// //       res.status(200).json(data);
// //     } catch (error) {
// //       res.status(500).json({ error: error.message });
// //     }
// //   }

// //   async deleteBudget(req, res) {
// //     const { id } = req.params;

// //     try {
// //       const { data, error } = await supabase
// //         .from('budgets')
// //         .delete()
// //         .eq('id', id)
// //         .eq('user_id', req.user.id);

// //       if (error) throw error;

// //       res.status(204).send();
// //     } catch (error) {
// //       res.status(500).json({ error: error.message });
// //     }
// //   }
// // }

// // export default new BudgetController();
// import { supabase } from '../integrations/supabaseClient.js';

// export const getBudgets = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
//       .toISOString()
//       .split('T')[0];
//     const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
//       .toISOString()
//       .split('T')[0];

//     const { data, error } = await supabase
//       .from('budgets')
//       .select('*')
//       .eq('user_id', userId)
//       .gte('period_start', startOfMonth)
//       .lte('period_end', endOfMonth);

//     if (error) throw error;

//     res.json({ success: true, data });
//   } catch (error) {
//     console.error('Error fetching budgets:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const createBudget = async (req, res) => {
//   try {
//     const { userId, totalBudget, categoryLimits } = req.body;
//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
//       .toISOString()
//       .split('T')[0];
//     const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
//       .toISOString()
//       .split('T')[0];

//     const { data, error } = await supabase
//       .from('budgets')
//       .insert([
//         {
//           user_id: userId,
//           total_budget: totalBudget,
//           category_limits: categoryLimits,
//           period_start: startOfMonth,
//           period_end: endOfMonth,
//         },
//       ])
//       .select();

//     if (error) throw error;

//     res.json({ success: true, data });
//   } catch (error) {
//     console.error('Error creating budget:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
import { supabase } from '../integrations/supabaseClient.js';

export const getBudgets = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    const { data, error } = await supabase
      .from('budgets')
      .select(`
        *,
        category_budgets (
          id,
          category_id,
          limit_amount
        )
      `)
      .eq('user_id', userId)
      .gte('period_start', startDate)
      .lte('period_end', endDate);

    if (error) throw error;

    // Transform the data to match frontend expectations
    const transformedData = data.map(budget => ({
      ...budget,
      category_limits: budget.category_budgets.reduce((acc, cb) => {
        acc[cb.category_id] = cb.limit_amount;
        return acc;
      }, {})
    }));

    res.json({ success: true, data: transformedData });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createBudget = async (req, res) => {
  try {
    const { userId, totalBudget, categoryLimits } = req.body;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];

    // First, create the budget
    const { data: budgetData, error: budgetError } = await supabase
      .from('budgets')
      .insert([
        {
          user_id: userId,
          total_budget: totalBudget,
          period_start: startOfMonth,
          period_end: endOfMonth,
        },
      ])
      .select();

    if (budgetError) throw budgetError;

    const budgetId = budgetData[0].id;

    // Then, create category budget limits if provided
    if (categoryLimits && Object.keys(categoryLimits).length > 0) {
      const categoryBudgetsData = Object.entries(categoryLimits).map(([categoryId, limitAmount]) => ({
        budget_id: budgetId,
        category_id: categoryId,
        limit_amount: limitAmount,
      }));

      const { error: categoryError } = await supabase
        .from('category_budgets')
        .insert(categoryBudgetsData);

      if (categoryError) {
        console.error('Error saving category limits:', categoryError);
        // Don't throw - budget was created successfully
      }
    }

    res.json({ success: true, data: budgetData });
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};