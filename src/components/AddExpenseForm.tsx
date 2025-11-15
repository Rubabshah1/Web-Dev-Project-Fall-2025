import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type Category = "grocery" | "shopping" | "utilities" | "car" | "other";

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
}

interface AddExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
}

export const AddExpenseForm = ({ onAddExpense }: AddExpenseFormProps) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("grocery");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      description,
      date: new Date().toISOString(),
    };

    onAddExpense(newExpense);
    
    toast({
      title: "Expense Added",
      description: `₹${parseFloat(amount).toLocaleString()} added to ${category}`,
    });

    setAmount("");
    setDescription("");
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 shadow-[var(--shadow-card)] border-border/50">
      <h2 className="text-2xl font-bold text-foreground mb-6">Add New Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-border bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger id="category" className="border-border bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grocery">🛒 Grocery</SelectItem>
                <SelectItem value="shopping">🛍️ Shopping</SelectItem>
                <SelectItem value="utilities">⚡ Utilities</SelectItem>
                <SelectItem value="car">🚗 Car</SelectItem>
                <SelectItem value="other">📋 Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground">Description</Label>
          <Input
            id="description"
            type="text"
            placeholder="What did you spend on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-border bg-background"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-[var(--transition-smooth)]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </form>
    </Card>
  );
};
