import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Settings, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import type { Category } from "@/pages/Index";

interface BudgetSettingsProps {
  userId: string;
  categories: Category[];
  onBudgetUpdate: () => void;
}

const budgetSchema = z.object({
  totalBudget: z.number().positive("Budget must be greater than 0").max(10000000, "Budget too large"),
  categoryLimits: z.record(z.number().positive("Limit must be greater than 0").max(10000000, "Limit too large"))
});

export const BudgetSettings = ({ userId, categories, onBudgetUpdate }: BudgetSettingsProps) => {
  const [open, setOpen] = useState(false);
  const [totalBudget, setTotalBudget] = useState("50000");
  const [categoryLimits, setCategoryLimits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchCurrentBudget();
    }
  }, [open]);

  const fetchCurrentBudget = async () => {
    // Get current month's budget
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const { data: budget } = await supabase
      .from('budgets')
      .select('*, category_budgets(*)')
      .eq('user_id', userId)
      .eq('period_start', startOfMonth)
      .eq('period_end', endOfMonth)
      .single();

    if (budget) {
      setTotalBudget(budget.total_budget.toString());
      
      const limits: Record<string, string> = {};
      budget.category_budgets?.forEach((cb: any) => {
        limits[cb.category_id] = cb.limit_amount.toString();
      });
      setCategoryLimits(limits);
    }
  };

  const handleSave = async () => {
    try {
      // Validate input
      const parsed = budgetSchema.parse({
        totalBudget: parseFloat(totalBudget),
        categoryLimits: Object.entries(categoryLimits).reduce((acc, [key, value]) => {
          acc[key] = parseFloat(value);
          return acc;
        }, {} as Record<string, number>)
      });

      setLoading(true);

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      // Check if budget exists for current month
      const { data: existingBudget } = await supabase
        .from('budgets')
        .select('id')
        .eq('user_id', userId)
        .eq('period_start', startOfMonth)
        .eq('period_end', endOfMonth)
        .single();

      let budgetId: string;

      if (existingBudget) {
        // Update existing budget
        const { error: updateError } = await supabase
          .from('budgets')
          .update({ total_budget: parsed.totalBudget })
          .eq('id', existingBudget.id);

        if (updateError) throw updateError;
        budgetId = existingBudget.id;

        // Delete existing category budgets
        await supabase
          .from('category_budgets')
          .delete()
          .eq('budget_id', budgetId);
      } else {
        // Create new budget
        const { data: newBudget, error: insertError } = await supabase
          .from('budgets')
          .insert([{
            user_id: userId,
            period_start: startOfMonth,
            period_end: endOfMonth,
            total_budget: parsed.totalBudget
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        budgetId = newBudget.id;
      }

      // Insert category budgets
      if (Object.keys(parsed.categoryLimits).length > 0) {
        const categoryBudgetInserts = Object.entries(parsed.categoryLimits).map(([categoryId, limit]) => ({
          budget_id: budgetId,
          category_id: categoryId,
          limit_amount: limit
        }));

        const { error: categoryError } = await supabase
          .from('category_budgets')
          .insert(categoryBudgetInserts);

        if (categoryError) throw categoryError;
      }

      toast({
        title: "Budget saved",
        description: "Your monthly budget has been updated successfully",
      });

      setOpen(false);
      onBudgetUpdate();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid input",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error saving budget",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Budget Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Monthly Budget Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Total Budget */}
          <Card className="p-4 bg-gradient-to-br from-card to-primary/5 border-primary/20">
            <div className="space-y-2">
              <Label htmlFor="total-budget" className="text-base font-semibold">
                Total Monthly Budget
              </Label>
              <Input
                id="total-budget"
                type="number"
                step="0.01"
                placeholder="50000"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className="text-lg font-semibold"
              />
              <p className="text-xs text-muted-foreground">
                Your overall monthly spending limit
              </p>
            </div>
          </Card>

          {/* Category Budgets */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Category Limits (Optional)</h3>
            <p className="text-xs text-muted-foreground">
              Set spending limits for individual categories
            </p>
            
            <div className="grid gap-3">
              {categories.map((category) => (
                <Card key={category.id} className="p-3 bg-background border-border/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.icon}</span>
                    <div className="flex-1">
                      <Label htmlFor={`cat-${category.id}`} className="text-sm font-medium">
                        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                      </Label>
                    </div>
                    <Input
                      id={`cat-${category.id}`}
                      type="number"
                      step="0.01"
                      placeholder="Limit"
                      value={categoryLimits[category.id] || ""}
                      onChange={(e) => setCategoryLimits({
                        ...categoryLimits,
                        [category.id]: e.target.value
                      })}
                      className="w-32"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Budget"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
