import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, AlertCircle } from "lucide-react";

interface BudgetOverviewProps {
  totalBudget: number;
  totalSpent: number;
  monthlyLimit: number;
}

export const BudgetOverview = ({ totalBudget, totalSpent, monthlyLimit }: BudgetOverviewProps) => {
  const remaining = totalBudget - totalSpent;
  const percentageUsed = (totalSpent / totalBudget) * 100;
  const isOverBudget = totalSpent > monthlyLimit;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
            <p className="text-3xl font-bold text-foreground mt-2">₹{totalBudget.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary/10">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-card to-destructive/5 shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
            <p className="text-3xl font-bold text-foreground mt-2">₹{totalSpent.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">{percentageUsed.toFixed(1)}% of budget</p>
          </div>
          <div className="p-3 rounded-xl bg-destructive/10">
            <TrendingUp className="h-6 w-6 text-destructive" />
          </div>
        </div>
      </Card>

      <Card className={`p-6 shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-[var(--shadow-soft)] ${
        isOverBudget 
          ? "bg-gradient-to-br from-card to-warning/10" 
          : "bg-gradient-to-br from-card to-success/10"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {isOverBudget ? "Over Budget" : "Remaining"}
            </p>
            <p className={`text-3xl font-bold mt-2 ${
              isOverBudget ? "text-warning" : "text-success"
            }`}>
              ₹{Math.abs(remaining).toLocaleString()}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${
            isOverBudget ? "bg-warning/10" : "bg-success/10"
          }`}>
            {isOverBudget ? (
              <AlertCircle className="h-6 w-6 text-warning" />
            ) : (
              <TrendingDown className="h-6 w-6 text-success" />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
