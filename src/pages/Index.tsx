import { useState, useEffect } from "react";
import { BudgetOverview } from "@/components/BudgetOverview";
import { AddExpenseForm, type Expense } from "@/components/AddExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { CategoryChart } from "@/components/CategoryChart";
import { Wallet } from "lucide-react";

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("budget-tracker-expenses");
    return saved ? JSON.parse(saved) : [];
  });
  
  const monthlyBudget = 50000; // Default monthly budget
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  useEffect(() => {
    localStorage.setItem("budget-tracker-expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (expense: Expense) => {
    setExpenses([expense, ...expenses]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Budget Tracker</h1>
              <p className="text-sm text-muted-foreground">Manage your monthly expenses</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Budget Overview Cards */}
        <section>
          <BudgetOverview 
            totalBudget={monthlyBudget}
            totalSpent={totalSpent}
            monthlyLimit={monthlyBudget}
          />
        </section>

        {/* Add Expense Form */}
        <section>
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </section>

        {/* Expense List and Chart */}
        <section className="grid gap-8 lg:grid-cols-2">
          <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
          <CategoryChart expenses={expenses} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Track your expenses • Stay on budget • Achieve financial goals</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
