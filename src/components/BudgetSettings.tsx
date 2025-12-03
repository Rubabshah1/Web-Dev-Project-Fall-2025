import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Settings, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
    try {
      // Get current month's budget from backend API
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      const response = await fetch(
        `http://localhost:5001/api/budgets?userId=${userId}&startDate=${startOfMonth}&endDate=${endOfMonth}`
      );
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        const budget = data.data[0];
        setTotalBudget(budget.total_budget.toString());
        
        if (budget.category_limits) {
          const limits: Record<string, string> = {};
          Object.entries(budget.category_limits).forEach(([categoryId, limit]: [string, any]) => {
            limits[categoryId] = limit.toString();
          });
          setCategoryLimits(limits);
        }
      }
    } catch (error) {
      console.error("Error fetching budget:", error);
      toast({
        title: "Error",
        description: "Failed to fetch current budget",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      // Validate input
      const parsed = budgetSchema.parse({
        totalBudget: parseFloat(totalBudget),
        categoryLimits: Object.entries(categoryLimits).reduce((acc, [key, value]) => {
          if (value) {
            acc[key] = parseFloat(value);
          }
          return acc;
        }, {} as Record<string, number>)
      });

      setLoading(true);

      // Send budget data to backend API
      const response = await fetch('http://localhost:5001/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          totalBudget: parsed.totalBudget,
          categoryLimits: parsed.categoryLimits,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to save budget');
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
                step="50.00"
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
                    {/* <span className="text-xl">{category.icon}</span> */}
                    <div className="flex-1">
                      <Label htmlFor={`cat-${category.id}`} className="text-sm font-medium">
                        {category.name.slice(0).toUpperCase()}
                      </Label>
                    </div>
                    <Input
                      id={`cat-${category.id}`}
                      type="number"
                      step="50.00"
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
