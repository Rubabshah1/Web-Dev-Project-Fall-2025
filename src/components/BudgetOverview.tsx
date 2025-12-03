// // import { Card } from "@/components/ui/card";
// // import { TrendingUp, TrendingDown, Wallet, AlertCircle } from "lucide-react";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { useState, useEffect } from "react";
// // import { useAuth } from "@/hooks/useAuth"; // assuming you have an auth hook
// // import { Skeleton } from "@/components/ui/skeleton";

// // const CURRENCIES = [
// //   { code: "USD", symbol: "$", name: "US Dollar" },
// //   { code: "EUR", symbol: "€", name: "Euro" },
// //   { code: "GBP", symbol: "£", name: "British Pound" },
// //   { code: "INR", symbol: "₹", name: "Indian Rupee" },
// //   { code: "JPY", symbol: "¥", name: "Japanese Yen" },
// //   { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
// //   { code: "AUD", symbol: "A$", name: "Australian Dollar" },
// //   { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
// // ] as const;

// // type CurrencyCode = (typeof CURRENCIES)[number]["code"];

// // export const BudgetOverview = () => {
// //   const { user } = useAuth(); // Get current user
// //   const [currency, setCurrency] = useState<CurrencyCode>("INR");
// //   const [totalBudget, setTotalBudget] = useState<number>(0);
// //   const [totalSpent, setTotalSpent] = useState<number>(0);
// //   const [monthlyLimit, setMonthlyLimit] = useState<number>(0);
// //   const [loading, setLoading] = useState(true);

// //   const formatter = new Intl.NumberFormat(undefined, {
// //     style: "currency",
// //     currency,
// //     minimumFractionDigits: 0,
// //     maximumFractionDigits: 2,
// //   });

// //   const selectedCurrency = CURRENCIES.find((c) => c.code === currency)!;
// //   useEffect(() => {
// //     if (!user) {
// //       setLoading(false);
// //       return;
// //     }

// //     const fetchBudgetData = async () => {
// //       try {
// //         setLoading(true);

// //         const now = new Date();
// //         const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
// //           .toISOString()
// //           .split("T")[0];
// //         const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
// //           .toISOString()
// //           .split("T")[0];

// //         // Fetch budget from backend API
// //         const budgetResponse = await fetch(
// //           `http://localhost:5001/api/budgets?userId=${user.id}`
// //         );
// //         const budgetData = await budgetResponse.json();
// //         const budgetAmount = budgetData.data?.[0]?.total_budget || 0;
// //         setTotalBudget(budgetAmount);
// //         setMonthlyLimit(budgetAmount);

// //         // Fetch expenses from backend API
// //         const expensesResponse = await fetch(
// //           `http://localhost:5001/api/expenses?userId=${user.id}&startDate=${startOfMonth}&endDate=${endOfMonth}`
// //         );
// //         const expensesData = await expensesResponse.json();
// //         const spent =
// //           expensesData.data?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
// //         setTotalSpent(spent);
// //       } catch (error) {
// //         console.error("Error fetching budget data:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchBudgetData();
// //   }, [user]);

// //   // Re-fetch when budget is updated (e.g. from settings dialog)
// //   const handleBudgetUpdate = () => {
// //     // This will trigger the useEffect above
// //     window.location.reload(); // Simple way, or better: refetch logic
// //     // Or extract fetch logic into a function and call it here
// //   };

// //   const remaining = totalBudget - totalSpent;
// //   const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
// //   const isOverBudget = totalSpent > monthlyLimit;

// //   if (!user) {
// //     return (
// //       <div className="text-center py-8 text-muted-foreground">
// //         Please sign in to view your budget.
// //       </div>
// //     );
// //   }

// //   if (loading) {
// //     return (
// //       <div className="grid gap-4 md:grid-cols-3">
// //         {[...Array(3)].map((_, i) => (
// //           <Card key={i} className="p-6">
// //             <Skeleton className="h-8 w-32 mb-2" />
// //             <Skeleton className="h-10 w-48" />
// //           </Card>
// //         ))}
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-4">
// //       {/* Currency Selector */}
// //       <div className="flex justify-end">
// //         <Select value={currency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
// //           <SelectTrigger className="w-[180px]">
// //             <SelectValue />
// //           </SelectTrigger>
// //           <SelectContent>
// //             {CURRENCIES.map((curr) => (
// //               <SelectItem key={curr.code} value={curr.code}>
// //                 <div className="flex items-center gap-2">
// //                   <span className="text-lg">{curr.symbol}</span>
// //                   <span>{curr.code} - {curr.name}</span>
// //                 </div>
// //               </SelectItem>
// //             ))}
// //           </SelectContent>
// //         </Select>
// //       </div>

// //       {/* Budget Cards */}
// //       <div className="grid gap-4 md:grid-cols-3">
// //         <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-[var(--shadow-soft)]">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
// //               <p className="text-3xl font-bold text-foreground mt-2">
// //                 {totalBudget === 0 ? "Not set" : formatter.format(totalBudget)}
// //               </p>
// //             </div>
// //             <div className="p-3 rounded-xl bg-primary/10">
// //               <Wallet className="h-6 w-6 text-primary" />
// //             </div>
// //           </div>
// //         </Card>

// //         <Card className="p-6 bg-gradient-to-br from-card to-destructive/5 shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-[var(--shadow-soft)]">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
// //               <p className="text-3xl font-bold text-foreground mt-2">
// //                 {formatter.format(totalSpent)}
// //               </p>
// //               <p className="text-xs text-muted-foreground mt-1">
// //                 {percentageUsed.toFixed(1)}% of budget
// //               </p>
// //             </div>
// //             <div className="p-3 rounded-xl bg-destructive/10">
// //               <TrendingUp className="h-6 w-6 text-destructive" />
// //             </div>
// //           </div>
// //         </Card>

// //         <Card
// //           className={`p-6 shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-[var(--shadow-soft)] ${
// //             isOverBudget
// //               ? "bg-gradient-to-br from-card to-warning/10"
// //               : "bg-gradient-to-br from-card to-success/10"
// //           }`}
// //         >
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-sm font-medium text-muted-foreground">
// //                 {isOverBudget ? "Over Budget" : "Remaining"}
// //               </p>
// //               <p
// //                 className={`text-3xl font-bold mt-2 ${
// //                   isOverBudget ? "text-warning" : "text-success"
// //                 }`}
// //               >
// //                 {totalBudget === 0
// //                   ? "Set a budget"
// //                   : `${selectedCurrency.symbol}${Math.abs(remaining).toLocaleString(undefined, {
// //                       minimumFractionDigits: 0,
// //                       maximumFractionDigits: 2,
// //                     })}${isOverBudget ? " over" : ""}`}
// //               </p>
// //             </div>
// //             <div className={`p-3 rounded-xl ${isOverBudget ? "bg-warning/10" : "bg-success/10"}`}>
// //               {isOverBudget ? (
// //                 <AlertCircle className="h-6 w-6 text-warning" />
// //               ) : (
// //                 <TrendingDown className="h-6 w-6 text-success" />
// //               )}
// //             </div>
// //           </div>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // };
// import { Card } from "@/components/ui/card";
// import { TrendingUp, TrendingDown, Wallet, AlertCircle } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useState, useEffect } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { Skeleton } from "@/components/ui/skeleton";

// const API_BASE_URL = "http://localhost:5001/api";

// const CURRENCIES = [
//   { code: "USD", symbol: "$", name: "US Dollar" },
//   { code: "EUR", symbol: "€", name: "Euro" },
//   { code: "GBP", symbol: "£", name: "British Pound" },
//   { code: "INR", symbol: "₹", name: "Indian Rupee" },
//   { code: "JPY", symbol: "¥", name: "Japanese Yen" },
//   { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
//   { code: "AUD", symbol: "A$", name: "Australian Dollar" },
//   { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
// ] as const;

// type CurrencyCode = (typeof CURRENCIES)[number]["code"];

// export const BudgetOverview = () => {
//   const { user } = useAuth();
//   const [currency, setCurrency] = useState<CurrencyCode>("INR");
//   const [totalBudget, setTotalBudget] = useState<number>(0);
//   const [totalSpent, setTotalSpent] = useState<number>(0);
//   const [monthlyLimit, setMonthlyLimit] = useState<number>(0);
//   const [loading, setLoading] = useState(true);

//   const formatter = new Intl.NumberFormat(undefined, {
//     style: "currency",
//     currency,
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2,
//   });

//   const selectedCurrency = CURRENCIES.find((c) => c.code === currency)!;

//   // useEffect(() => {
//   //   if (!user) {
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   const fetchBudgetData = async () => {
//   //     try {
//   //       setLoading(true);

//   //       const now = new Date();
//   //       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
//   //         .toISOString()
//   //         .split("T")[0];
//   //       const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
//   //         .toISOString()
//   //         .split("T")[0];

//   //       // Fetch budget from backend API
//   //       const budgetResponse = await fetch(
//   //         `${API_BASE_URL}/budgets?userId=${user.id}&startDate=${startOfMonth}&endDate=${endOfMonth}`
//   //       );
//   //       const budgetData = await budgetResponse.json();
//   //       const budgetAmount = budgetData.data?.[0]?.total_budget || 0;
//   //       setTotalBudget(budgetAmount);
//   //       setMonthlyLimit(budgetAmount);

//   //       // Fetch expenses from backend API
//   //       const expensesResponse = await fetch(
//   //         `${API_BASE_URL}/expenses?userId=${user.id}&startDate=${startOfMonth}&endDate=${endOfMonth}`
//   //       );
//   //       const expensesData = await expensesResponse.json();
//   //       const spent =
//   //         expensesData.data?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
//   //       setTotalSpent(spent);
//   //     } catch (error) {
//   //       console.error("Error fetching budget data:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchBudgetData();
//   // }, [user]);

//   const fetchBudgetAndExpenses = async () => {
//   if (!user) return;

//   try {
//     setLoading(true);

//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
//       .toISOString()
//       .split("T")[0];
//     const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
//       .toISOString()
//       .split("T")[0];

//     // Fetch budget
//     const budgetRes = await fetch(
//       `${API_BASE_URL}/budgets?userId=${user.id}&startDate=${startOfMonth}&endDate=${endOfMonth}`
//     );
//     const budgetData = await budgetRes.json();
//     const budgetAmount = budgetData.data?.[0]?.total_budget || 0;
//     setTotalBudget(budgetAmount);
//     setMonthlyLimit(budgetAmount);

//     // Fetch expenses
//     const expensesRes = await fetch(
//       `${API_BASE_URL}/expenses?userId=${user.id}&startDate=${startOfMonth}&endDate=${endOfMonth}`
//     );
//     const expensesData = await expensesRes.json();
//     const spent = expensesData.data?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
//     setTotalSpent(spent);

//   } catch (error) {
//     console.error("Error fetching budget and expenses:", error);
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   fetchBudgetAndExpenses();
// }, [user]);
//   const addExpense = async (newExpense) => {
//   await fetch(`${API_BASE_URL}/expenses`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(newExpense),
//   });

//   // Refresh totals
//   fetchBudgetAndExpenses();
// };

// const deleteExpense = async (expenseId) => {
//   await fetch(`${API_BASE_URL}/expenses/${expenseId}`, { method: "DELETE" });

//   // Refresh totals
//   fetchBudgetAndExpenses();
// };

//   const remaining = totalBudget - totalSpent;
//   const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
//   const isOverBudget = totalSpent > monthlyLimit;
  

//   if (!user) {
//     return (
//       <div className="text-center py-8 text-muted-foreground">
//         Please sign in to view your budget.
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="grid gap-4 md:grid-cols-3">
//         {[...Array(3)].map((_, i) => (
//           <Card key={i} className="p-6">
//             <Skeleton className="h-8 w-32 mb-2" />
//             <Skeleton className="h-10 w-48" />
//           </Card>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* Currency Selector */}
//       <div className="flex justify-end">
//         <Select value={currency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             {CURRENCIES.map((curr) => (
//               <SelectItem key={curr.code} value={curr.code}>
//                 <div className="flex items-center gap-2">
//                   <span className="text-lg">{curr.symbol}</span>
//                   <span>{curr.code} - {curr.name}</span>
//                 </div>
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Budget Cards */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-[var(--shadow-soft)]">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
//               <p className="text-3xl font-bold text-foreground mt-2">
//                 {totalBudget === 0 ? "Not set" : formatter.format(totalBudget)}
//               </p>
//             </div>
//             <div className="p-3 rounded-xl bg-primary/10">
//               <Wallet className="h-6 w-6 text-primary" />
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6 bg-gradient-to-br from-card to-destructive/5 shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-[var(--shadow-soft)]">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
//               <p className="text-3xl font-bold text-foreground mt-2">
//                 {formatter.format(totalSpent)}
//               </p>
//               <p className="text-xs text-muted-foreground mt-1">
//                 {percentageUsed.toFixed(1)}% of budget
//               </p>
//             </div>
//             <div className="p-3 rounded-xl bg-destructive/10">
//               <TrendingUp className="h-6 w-6 text-destructive" />
//             </div>
//           </div>
//         </Card>

//         <Card
//           className={`p-6 shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-[var(--shadow-soft)] ${
//             isOverBudget
//               ? "bg-gradient-to-br from-card to-warning/10"
//               : "bg-gradient-to-br from-card to-success/10"
//           }`}
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">
//                 {isOverBudget ? "Over Budget" : "Remaining"}
//               </p>
//               <p
//                 className={`text-3xl font-bold mt-2 ${
//                   isOverBudget ? "text-warning" : "text-success"
//                 }`}
//               >
//                 {totalBudget === 0
//                   ? "Set a budget"
//                   : `${selectedCurrency.symbol}${Math.abs(remaining).toLocaleString(undefined, {
//                       minimumFractionDigits: 0,
//                       maximumFractionDigits: 2,
//                     })}${isOverBudget ? " over" : ""}`}
//               </p>
//             </div>
//             <div className={`p-3 rounded-xl ${isOverBudget ? "bg-warning/10" : "bg-success/10"}`}>
//               {isOverBudget ? (
//                 <AlertCircle className="h-6 w-6 text-warning" />
//               ) : (
//                 <TrendingDown className="h-6 w-6 text-success" />
//               )}
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

const API_BASE_URL = "http://localhost:5001/api";

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "PKR", symbol: "PKR ", name: "Pakistani Rupee" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
] as const;

type CurrencyCode = (typeof CURRENCIES)[number]["code"];
type Expense = { id: string; amount: number; description?: string };

interface BudgetOverviewProps {
  refreshKey?: number;
}

export const BudgetOverview = ({ refreshKey }: BudgetOverviewProps) => {
  const { user } = useAuth();
  const [currency, setCurrency] = useState<CurrencyCode>("PKR");
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [monthlyLimit, setMonthlyLimit] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const selectedCurrency = CURRENCIES.find((c) => c.code === currency)!;

  /** Fetch budget and expenses */
  const fetchBudgetAndExpenses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];

      // Fetch budget
      const budgetRes = await fetch(
        `${API_BASE_URL}/budgets?userId=${user.id}&startDate=${startOfMonth}&endDate=${endOfMonth}`
      );
      const budgetData = await budgetRes.json();
      const budgetAmount = budgetData.data?.[0]?.total_budget || 0;
      setTotalBudget(budgetAmount);
      setMonthlyLimit(budgetAmount);

      // Fetch expenses
      const expensesRes = await fetch(
        `${API_BASE_URL}/expenses?userId=${user.id}&startDate=${startOfMonth}&endDate=${endOfMonth}`
      );
      const expensesData = await expensesRes.json();
      const fetchedExpenses: Expense[] = expensesData.data || [];
      setExpenses(fetchedExpenses);

      const spent = fetchedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      setTotalSpent(spent);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetAndExpenses();
  }, [user, refreshKey]);

  /** Add an expense (real-time update) */
  const addExpense = async (newExpense: Expense) => {
    try {
      const res = await fetch(`${API_BASE_URL}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });
      const savedExpense = await res.json();

      // Optimistic update
      setExpenses((prev) => [...prev, savedExpense]);
      setTotalSpent((prev) => prev + savedExpense.amount);
    } catch (err) {
      console.error(err);
    }
  };

  /** Delete an expense (real-time update) */
  const deleteExpense = async (expenseId: string) => {
    try {
      await fetch(`${API_BASE_URL}/expenses/${expenseId}`, { method: "DELETE" });
      
      // Update state locally
      setExpenses((prev) => prev.filter((exp) => exp.id !== expenseId));
      const deletedExpense = expenses.find((exp) => exp.id === expenseId);
      if (deletedExpense) setTotalSpent((prev) => prev - deletedExpense.amount);
    } catch (err) {
      console.error(err);
    }
  };

  const remaining = totalBudget - totalSpent;
  const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOverBudget = totalSpent > monthlyLimit;

  if (!user) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Please sign in to view your budget.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-10 w-48" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Currency Selector */}
      <div className="flex justify-end">
        <Select value={currency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((curr) => (
              <SelectItem key={curr.code} value={curr.code}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{curr.symbol}</span>
                  <span>{curr.code} - {curr.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Budget Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {totalBudget === 0 ? "Not set" : formatter.format(totalBudget)}
              </p>
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
              <p className="text-3xl font-bold text-foreground mt-2">
                {formatter.format(totalSpent)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {percentageUsed.toFixed(1)}% of budget
              </p>
            </div>
            <div className="p-3 rounded-xl bg-destructive/10">
              <TrendingUp className="h-6 w-6 text-destructive" />
            </div>
          </div>
        </Card>

        <Card
          className={`p-6 shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-[var(--shadow-soft)] ${
            isOverBudget
              ? "bg-gradient-to-br from-card to-warning/10"
              : "bg-gradient-to-br from-card to-success/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {isOverBudget ? "Over Budget" : "Remaining"}
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  isOverBudget ? "text-warning" : "text-success"
                }`}
              >
                {totalBudget === 0
                  ? "Set a budget"
                  : `${selectedCurrency.symbol}${Math.abs(remaining).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}${isOverBudget ? " over" : ""}`}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isOverBudget ? "bg-warning/10" : "bg-success/10"}`}>
              {isOverBudget ? (
                <AlertCircle className="h-6 w-6 text-warning" />
              ) : (
                <TrendingDown className="h-6 w-6 text-success" />
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
