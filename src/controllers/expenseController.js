// import { supabase } from '../integrations/supabaseClient.js';

// class ExpenseController {
//   async getExpenses(req, res) {
//     const { user_id } = req.params;

//     const { data, error } = await supabase
//       .from('expenses')
//       .select('*')
//       .eq('user_id', user_id);

//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     return res.status(200).json(data);
//   }

//   async addExpense(req, res) {
//     const { user_id, category_id, amount, note, expense_date } = req.body;

//     const { data, error } = await supabase
//       .from('expenses')
//       .insert([{ user_id, category_id, amount, note, expense_date }]);

//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     return res.status(201).json(data);
//   }

//   async updateExpense(req, res) {
//     const { id } = req.params;
//     const { category_id, amount, note, expense_date } = req.body;

//     const { data, error } = await supabase
//       .from('expenses')
//       .update({ category_id, amount, note, expense_date })
//       .eq('id', id);

//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     return res.status(200).json(data);
//   }

//   async deleteExpense(req, res) {
//     const { id } = req.params;

//     const { error } = await supabase
//       .from('expenses')
//       .delete()
//       .eq('id', id);

//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     return res.status(204).send();
//   }
// }

// export default new ExpenseController();
import { supabase } from '../integrations/supabaseClient.js';

export const getExpenses = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .gte('expense_date', startDate)
      .lte('expense_date', endDate)
      .order('expense_date', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { userId, categoryId, amount, note, expenseDate } = req.body;

    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          user_id: userId,
          category_id: categoryId,
          amount,
          note,
          expense_date: expenseDate,
        },
      ])
      .select();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);

    if (error) throw error;

    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};