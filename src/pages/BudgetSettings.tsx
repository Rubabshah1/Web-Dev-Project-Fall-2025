import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string | null;
}

interface CategoryBudget {
  category_id: string;
  limit_amount: number;
}

export default function BudgetSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [totalBudget, setTotalBudget] = useState("");
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);

  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchCurrentBudget();
    }
  }, [user]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user?.id)
      .order("name");

    if (!error && data) {
      setCategories(data);
    }
  };

  const fetchCurrentBudget = async () => {
    const now = new Date();
    const { data: budgetData } = await supabase
      .from("budgets")
      .select("*, category_budgets(*)")
      .eq("user_id", user?.id)
      .lte("period_start", now.toISOString())
      .gte("period_end", now.toISOString())
      .single();

    if (budgetData) {
      setTotalBudget(budgetData.total_budget.toString());
      const start = new Date(budgetData.period_start);
      const end = new Date(budgetData.period_end);
      const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
      setPeriod(diffMonths >= 11 ? "yearly" : "monthly");
      
      if (budgetData.category_budgets) {
        setCategoryBudgets(budgetData.category_budgets.map((cb: any) => ({
          category_id: cb.category_id,
          limit_amount: cb.limit_amount
        })));
      }
    }
  };

  const handleSaveBudget = async () => {
    if (!totalBudget || parseFloat(totalBudget) <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    setLoading(true);

    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = period === "monthly"
      ? new Date(now.getFullYear(), now.getMonth() + 1, 0)
      : new Date(now.getFullYear(), 11, 31);

    // Delete existing budget for this period
    await supabase
      .from("budgets")
      .delete()
      .eq("user_id", user?.id)
      .gte("period_end", now.toISOString());

    // Create new budget
    const { data: budgetData, error: budgetError } = await supabase
      .from("budgets")
      .insert({
        user_id: user?.id,
        period_start: periodStart.toISOString().split("T")[0],
        period_end: periodEnd.toISOString().split("T")[0],
        total_budget: parseFloat(totalBudget)
      })
      .select()
      .single();

    if (budgetError) {
      toast.error("Failed to save budget");
      setLoading(false);
      return;
    }

    // Save category budgets
    if (categoryBudgets.length > 0) {
      const categoryBudgetInserts = categoryBudgets
        .filter(cb => cb.limit_amount > 0)
        .map(cb => ({
          budget_id: budgetData.id,
          category_id: cb.category_id,
          limit_amount: cb.limit_amount
        }));

      if (categoryBudgetInserts.length > 0) {
        await supabase.from("category_budgets").insert(categoryBudgetInserts);
      }
    }

    toast.success("Budget saved successfully!");
    setLoading(false);
    navigate("/");
  };

  const addCategoryBudget = () => {
    setCategoryBudgets([...categoryBudgets, { category_id: "", limit_amount: 0 }]);
  };

  const updateCategoryBudget = (index: number, field: "category_id" | "limit_amount", value: string | number) => {
    const updated = [...categoryBudgets];
    updated[index] = { ...updated[index], [field]: value };
    setCategoryBudgets(updated);
  };

  const removeCategoryBudget = (index: number) => {
    setCategoryBudgets(categoryBudgets.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Budget Settings</CardTitle>
            <CardDescription>Set your budget for the current period and optional category limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Budget Period</Label>
                <Select value={period} onValueChange={(v) => setPeriod(v as "monthly" | "yearly")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Total Budget (₹)</Label>
                <Input
                  type="number"
                  placeholder="50000"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Category Budgets (Optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCategoryBudget}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>

              {categoryBudgets.map((cb, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={cb.category_id}
                      onValueChange={(v) => updateCategoryBudget(index, "category_id", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Limit (₹)</Label>
                    <Input
                      type="number"
                      placeholder="5000"
                      value={cb.limit_amount || ""}
                      onChange={(e) => updateCategoryBudget(index, "limit_amount", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCategoryBudget(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              onClick={handleSaveBudget}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Saving..." : "Save Budget"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
