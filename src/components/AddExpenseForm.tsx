import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { Category } from "@/pages/Index";

interface AddExpenseFormProps {
  onAddExpense: (category: string, amount: number, note: string) => void;
  categories: Category[];
}

const defaultCategories = [
  { name: 'grocery', icon: '🛒', label: 'Grocery' },
  { name: 'shopping', icon: '🛍️', label: 'Shopping' },
  { name: 'utilities', icon: '⚡', label: 'Utilities' },
  { name: 'car', icon: '🚗', label: 'Car' },
  { name: 'other', icon: '📋', label: 'Other' },
];

export const AddExpenseForm = ({ onAddExpense, categories }: AddExpenseFormProps) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("grocery");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    onAddExpense(category, parseFloat(amount), description);

    setAmount("");
    setDescription("");
  };

  // Merge default categories with user's custom categories
  const allCategories = [
    ...defaultCategories,
    ...categories
      .filter(c => !defaultCategories.some(dc => dc.name.toLowerCase() === c.name.toLowerCase()))
      .map(c => ({ name: c.name, icon: c.icon || '📋', label: c.name.charAt(0).toUpperCase() + c.name.slice(1) }))
  ];

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
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="border-border bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map(cat => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
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
