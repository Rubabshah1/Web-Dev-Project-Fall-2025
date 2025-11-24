import { Card } from "@/components/ui/card";
import { useMemo } from "react";

interface ExpenseWithCategory {
  id: string;
  amount: number;
  categoryName: string;
  categoryIcon: string;
}

interface CategoryChartProps {
  expenses: ExpenseWithCategory[];
}

const getCategoryColor = (categoryName: string): string => {
  const colors: Record<string, string> = {
    grocery: "hsl(var(--chart-2))",
    shopping: "hsl(var(--chart-1))",
    utilities: "hsl(var(--chart-3))",
    car: "hsl(var(--chart-4))",
    other: "hsl(var(--chart-5))",
  };
  return colors[categoryName.toLowerCase()] || "hsl(var(--chart-5))";
};

export const CategoryChart = ({ expenses }: CategoryChartProps) => {
  const categoryTotals = useMemo(() => {
    const totals: Record<string, { amount: number; icon: string }> = {};
    expenses.forEach((expense) => {
      if (!totals[expense.categoryName]) {
        totals[expense.categoryName] = { amount: 0, icon: expense.categoryIcon };
      }
      totals[expense.categoryName].amount += expense.amount;
    });
    return totals;
  }, [expenses]);

  const totalSpent = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.amount, 0);
  const sortedCategories = Object.entries(categoryTotals).sort(([, a], [, b]) => b.amount - a.amount);

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 shadow-[var(--shadow-card)] border-border/50">
      <h2 className="text-2xl font-bold text-foreground mb-6">Spending by Category</h2>
      
      {sortedCategories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No data to display</p>
          <p className="text-sm mt-2">Add expenses to see your spending breakdown</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCategories.map(([categoryName, data]) => {
            const percentage = ((data.amount / totalSpent) * 100).toFixed(1);
            return (
              <div key={categoryName} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground flex items-center gap-2">
                    <span className="text-lg">{data.icon}</span>
                    {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                  </span>
                  <span className="text-muted-foreground">{percentage}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-3"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getCategoryColor(categoryName),
                      }}
                    >
                      {parseFloat(percentage) > 15 && (
                        <span className="text-xs font-semibold text-white">
                          ₹{data.amount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  {parseFloat(percentage) <= 15 && (
                    <span className="text-sm font-semibold text-foreground min-w-[80px] text-right">
                      ₹{data.amount.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
