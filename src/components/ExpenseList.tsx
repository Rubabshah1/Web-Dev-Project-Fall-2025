import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Expense, Category } from "./AddExpenseForm";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const categoryColors: Record<Category, string> = {
  grocery: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  shopping: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  utilities: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  car: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  other: "bg-chart-5/20 text-chart-5 border-chart-5/30",
};

const categoryEmojis: Record<Category, string> = {
  grocery: "🛒",
  shopping: "🛍️",
  utilities: "⚡",
  car: "🚗",
  other: "📋",
};

export const ExpenseList = ({ expenses, onDeleteExpense }: ExpenseListProps) => {
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 shadow-[var(--shadow-card)] border-border/50">
      <h2 className="text-2xl font-bold text-foreground mb-4">Recent Expenses</h2>
      <ScrollArea className="h-[400px] pr-4">
        {sortedExpenses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No expenses yet</p>
            <p className="text-sm mt-2">Start tracking by adding your first expense above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="p-4 rounded-lg bg-background border border-border hover:border-primary/30 transition-[var(--transition-smooth)] group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={categoryColors[expense.category]}>
                        {categoryEmojis[expense.category]} {expense.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                    {expense.description && (
                      <p className="text-sm text-foreground mb-2">{expense.description}</p>
                    )}
                    <p className="text-2xl font-bold text-foreground">
                      ₹{expense.amount.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteExpense(expense.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};
