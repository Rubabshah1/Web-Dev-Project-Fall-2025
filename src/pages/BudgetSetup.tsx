import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:5001/api";

type BudgetType = "monthly" | "yearly";

export const BudgetSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [budgetType, setBudgetType] = useState<BudgetType>("monthly");
  const [budgetAmount, setBudgetAmount] = useState("50000");
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleNext = async () => {
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      toast({
        title: "Invalid budget",
        description: "Please enter a valid budget amount",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const now = new Date();
      let startDate, endDate;

      if (budgetType === "monthly") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
      } else {
        startDate = new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0];
        endDate = new Date(now.getFullYear(), 11, 31).toISOString().split("T")[0];
      }

      const response = await fetch(`${API_BASE_URL}/budgets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          totalBudget: parseFloat(budgetAmount),
          categoryLimits: {},
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create budget");
      }

      toast({
        title: "Budget created",
        description: `Your ${budgetType} budget of PKR ${parseFloat(budgetAmount).toLocaleString()} is set!`,
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create budget",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Setup Your Budget</h1>
              <p className="text-sm text-muted-foreground">Step 1 of 3</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Progress</span>
              <span className="text-sm text-muted-foreground">1/3</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-primary rounded-full h-2 w-1/3 transition-all duration-300" />
            </div>
          </div>

          <Card className="p-8 space-y-8">
            {/* Budget Type Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">What type of budget would you like to set?</Label>
              <RadioGroup value={budgetType} onValueChange={(value) => setBudgetType(value as BudgetType)}>
                <div className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <div className="flex-1">
                    <Label htmlFor="monthly" className="text-base font-medium cursor-pointer">
                      Monthly Budget
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Set a spending limit for each month
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="yearly" id="yearly" />
                  <div className="flex-1">
                    <Label htmlFor="yearly" className="text-base font-medium cursor-pointer">
                      Yearly Budget
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Set a spending limit for the entire year
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Budget Amount Input */}
            <div className="space-y-4">
              <Label htmlFor="budget-amount" className="text-base font-semibold">
                {budgetType === "monthly" ? "Monthly" : "Yearly"} Budget Amount
              </Label>
              <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-primary">PKR</span>
                <Input
                  id="budget-amount"
                  type="number"
                  step="100"
                  placeholder="50000"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="text-2xl font-semibold p-4 h-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                You can adjust this later in settings
              </p>
            </div>

            {/* Info Box */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <p className="text-sm text-foreground">
                💡 <span className="font-medium">Pro tip:</span> Set a realistic budget based on your income and expenses. You can add category-specific limits after setup.
              </p>
            </Card>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                Go Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={loading}
                className="flex-1 gap-2"
              >
                {loading ? "Setting up..." : "Next"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BudgetSetup;