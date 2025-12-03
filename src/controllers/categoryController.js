import { supabase } from "../integrations/supabaseClient.js";

class CategoryController {
  async getCategories(req, res) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addCategory(req, res) {
    const { name, icon } = req.body;

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ name, icon }])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
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