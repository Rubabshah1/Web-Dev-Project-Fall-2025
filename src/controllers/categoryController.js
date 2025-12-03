import { supabase } from "../integrations/supabaseClient.js";

class CategoryController {
  async getCategories(req, res) {
    try {
      const { userId } = req.query;

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addCategory(req, res) {
    const { userId, name, icon } = req.body;

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ 
          user_id: userId,
          name, 
          icon 
        }])
        .select();

      if (error) throw error;

      res.status(201).json({ success: true, data });
    } catch (error) {
      // Handle duplicate (user_id, name) gracefully by returning existing category
      if (error && error.code === "23505") {
        try {
          const { data: existing, error: fetchError } = await supabase
            .from("categories")
            .select("*")
            .eq("user_id", userId)
            .eq("name", name)
            .limit(1);

          if (fetchError) throw fetchError;

          return res.status(200).json({ success: true, data: existing });
        } catch (fetchErr) {
          return res.status(500).json({ success: false, error: fetchErr.message });
        }
      }

      res.status(500).json({ success: false, error: error.message });
    }
  }

  async updateCategory(req, res) {
    const { id } = req.params;
    const { name, icon } = req.body;

    try {
      const { data, error } = await supabase
        .from("categories")
        .update({ name, icon })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteCategory(req, res) {
    const { id } = req.params;

    try {
      const { data, error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CategoryController();