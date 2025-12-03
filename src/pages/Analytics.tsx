import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5001/api";

interface Expense {
  id: string;
  category_id: string;
  amount: number;
  expense_date: string;
  categoryName?: string;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

export const Analytics = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories", user?.id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/categories?userId=${user!.id}`);
      const data = await response.json();
      return data.data || [];
    },
    enabled: !!user,
  });

  // Fetch expenses
  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses", user?.id, timeframe],
    queryFn: async () => {
      const now = new Date();
      let startDate, endDate;

      if (timeframe === "monthly") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
      } else {
        startDate = new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0];
        endDate = new Date(now.getFullYear(), 11, 31).toISOString().split("T")[0];
      }

      const response = await fetch(
        `${API_BASE_URL}/expenses?userId=${user!.id}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      return data.data || [];
    },
    enabled: !!user,
  });

  // Process data for category pie chart
  const categoryData = expenses.reduce((acc: Record<string, number>, exp: Expense) => {
    const category = categories.find((c: Category) => c.id === exp.category_id);
    const name = category?.name || "Other";
    acc[name] = (acc[name] || 0) + exp.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([name, amount]) => ({
    name,
    value: amount as number,
  }));

  // Process data for time-series spending chart
  let lineData: { date: string; amount: number }[] = [];

  if (timeframe === "monthly") {
    // Group by exact calendar date within the current month
    const dailyData = expenses.reduce((acc: Record<string, number>, exp: Expense) => {
      acc[exp.expense_date] = (acc[exp.expense_date] || 0) + exp.amount;
      return acc;
    }, {});

    lineData = Object.entries(dailyData)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        amount: amount as number,
      }));
  } else {
    // Yearly view: group by month (Jan, Feb, ...)
    const monthlyData = expenses.reduce((acc: Record<string, number>, exp: Expense) => {
      const d = new Date(exp.expense_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // e.g. 2025-01
      acc[key] = (acc[key] || 0) + exp.amount;
      return acc;
    }, {});

    lineData = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, amount]) => {
        const [year, month] = key.split("-").map(Number);
        const label = new Date(year, month - 1, 1).toLocaleDateString("en-US", {
          month: "short",
        });
        return {
          date: label,
          amount: amount as number,
        };
      });
  }

  const totalSpent = expenses.reduce((sum: number, exp: Expense) => sum + exp.amount, 0);
  const averageDaily = totalSpent / (expenses.length || 1);
  const largestExpense = Math.max(...expenses.map((e: Expense) => e.amount), 0);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant={timeframe === "monthly" ? "default" : "outline"}
                onClick={() => setTimeframe("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={timeframe === "yearly" ? "default" : "outline"}
                onClick={() => setTimeframe("yearly")}
              >
                Yearly
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-card to-blue/5 border-blue/20">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
              <p className="text-3xl font-bold text-foreground">PKR {totalSpent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{timeframe === "monthly" ? "This month" : "This year"}</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-green/5 border-green/20">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Average Daily</p>
              <p className="text-3xl font-bold text-foreground">PKR {averageDaily.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-xs text-muted-foreground">{expenses.length} transactions</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-orange/5 border-orange/20">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Largest Expense</p>
              <p className="text-3xl font-bold text-foreground">PKR {largestExpense.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Single transaction</p>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Category Pie Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: PKR ${value.toLocaleString()}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `PKR ${(value as number).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No spending data available
              </div>
            )}
          </Card>

          {/* Daily Spending Line Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Spending Trend</h3>
            {lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip formatter={(value) => `PKR ${(value as number).toLocaleString()}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Daily Spend"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No spending data available
              </div>
            )}
          </Card>

          {/* Category Breakdown Bar Chart */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pieData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip formatter={(value) => `PKR ${(value as number).toLocaleString()}`} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Amount" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No spending data available
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;