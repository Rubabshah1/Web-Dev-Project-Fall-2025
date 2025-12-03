// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import { supabase } from "@/integrations/supabase/client";
// import { BudgetOverview } from "@/components/BudgetOverview";
// import { BudgetSettings } from "@/components/BudgetSettings";
// import { AddExpenseForm } from "@/components/AddExpenseForm";
// import { ExpenseList } from "@/components/ExpenseList";
// import { CategoryChart } from "@/components/CategoryChart";
// import { Button } from "@/components/ui/button";
// import { Wallet, LogOut } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// export interface Expense {
//   id: string;
//   user_id: string;
//   category_id: string;
//   amount: number;
//   note: string | null;
//   expense_date: string;
//   created_at: string;
// }

// export interface Category {
//   id: string;
//   user_id: string;
//   name: string;
//   icon: string | null;
//   created_at: string;
// }

// const Index = () => {
//   const { user, loading: authLoading, signOut } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [monthlyBudget, setMonthlyBudget] = useState(50000);
//   const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({});

//   useEffect(() => {
//     if (!authLoading && !user) {
//       navigate('/auth');
//     }
//   }, [user, authLoading, navigate]);

//   useEffect(() => {
//     if (user) {
//       fetchCategories();
//       fetchExpenses();
//       fetchBudget();
//     }
//   }, [user]);

//   const fetchCategories = async () => {
//     const { data, error } = await supabase
//       .from('categories')
//       .select('*')
//       .order('created_at', { ascending: true });

//     if (error) {
//       console.error('Error fetching categories:', error);
//     } else {
//       setCategories(data || []);
//     }
//   };

//   const fetchBudget = async () => {
//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
//     const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

//     const { data: budget } = await supabase
//       .from('budgets')
//       .select('*, category_budgets(*)')
//       .eq('user_id', user?.id)
//       .eq('period_start', startOfMonth)
//       .eq('period_end', endOfMonth)
//       .single();

//     if (budget) {
//       setMonthlyBudget(Number(budget.total_budget));
      
//       const limits: Record<string, number> = {};
//       budget.category_budgets?.forEach((cb: any) => {
//         limits[cb.category_id] = Number(cb.limit_amount);
//       });
//       setCategoryBudgets(limits);
//     }
//   };

//   const fetchExpenses = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('expenses')
//       .select('*')
//       .order('expense_date', { ascending: false });

//     if (error) {
//       console.error('Error fetching expenses:', error);
//       toast({
//         title: 'Error loading expenses',
//         description: error.message,
//         variant: 'destructive',
//       });
//     } else {
//       setExpenses(data || []);
//     }
//     setLoading(false);
//   };

//   const handleAddExpense = async (categoryName: string, amount: number, note: string) => {
//     if (!user) return;

//     // Find or create category
//     let category = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
    
//     if (!category) {
//       const { data: newCategory, error: categoryError } = await supabase
//         .from('categories')
//         .insert([{ 
//           user_id: user.id, 
//           name: categoryName,
//           icon: getCategoryIcon(categoryName)
//         }])
//         .select()
//         .single();

//       if (categoryError) {
//         toast({
//           title: 'Error creating category',
//           description: categoryError.message,
//           variant: 'destructive',
//         });
//         return;
//       }
      
//       category = newCategory;
//       setCategories([...categories, newCategory]);
//     }

//     // Add expense
//     const { error } = await supabase
//       .from('expenses')
//       .insert([{
//         user_id: user.id,
//         category_id: category.id,
//         amount,
//         note: note || null,
//         expense_date: new Date().toISOString().split('T')[0]
//       }]);

//     if (error) {
//       toast({
//         title: 'Error adding expense',
//         description: error.message,
//         variant: 'destructive',
//       });
//     } else {
//       toast({
//         title: 'Expense Added',
//         description: `₹${amount.toLocaleString()} added to ${categoryName}`,
//       });
//       fetchExpenses();
//     }
//   };

//   const handleDeleteExpense = async (id: string) => {
//     const { error } = await supabase
//       .from('expenses')
//       .delete()
//       .eq('id', id);

//     if (error) {
//       toast({
//         title: 'Error deleting expense',
//         description: error.message,
//         variant: 'destructive',
//       });
//     } else {
//       setExpenses(expenses.filter(expense => expense.id !== id));
//       toast({
//         title: 'Expense deleted',
//         description: 'Successfully removed expense',
//       });
//     }
//   };

//   const handleSignOut = async () => {
//     const { error } = await signOut();
//     if (error) {
//       toast({
//         title: 'Error signing out',
//         description: error.message,
//         variant: 'destructive',
//       });
//     } else {
//       navigate('/auth');
//     }
//   };

//   const getCategoryIcon = (categoryName: string): string => {
//     const icons: Record<string, string> = {
//       grocery: '🛒',
//       shopping: '🛍️',
//       utilities: '⚡',
//       car: '🚗',
//       other: '📋',
//     };
//     return icons[categoryName.toLowerCase()] || '📋';
//   };

//   const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // // Map expenses to include category name for display
  // const expensesWithCategory = expenses.map(expense => {
  //   const category = categories.find(c => c.id === expense.category_id);
  //   return {
  //     ...expense,
  //     categoryName: category?.name || 'Unknown',
  //     categoryIcon: category?.icon || '📋'
  //   };
  // });

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
//                 <Wallet className="h-6 w-6 text-primary-foreground" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-foreground">Budget Tracker</h1>
//                 <p className="text-sm text-muted-foreground">Manage your monthly expenses</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <BudgetSettings 
//                 userId={user.id} 
//                 categories={categories} 
//                 onBudgetUpdate={() => {
//                   fetchBudget();
//                   fetchExpenses();
//                 }} 
//               />
//               <Button
//                 variant="outline"
//                 onClick={handleSignOut}
//                 className="gap-2"
//               >
//                 <LogOut className="h-4 w-4" />
//                 Sign Out
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8 space-y-8">
//         {/* Budget Overview Cards */}
//         <section>
//           <BudgetOverview 
//             totalBudget={monthlyBudget}
//             totalSpent={totalSpent}
//             monthlyLimit={monthlyBudget}
//           />
//         </section>

//         {/* Add Expense Form */}
//         <section>
//           <AddExpenseForm onAddExpense={handleAddExpense} categories={categories} />
//         </section>

//         {/* Expense List and Chart */}
//         <section className="grid gap-8 lg:grid-cols-2">
//           <ExpenseList expenses={expensesWithCategory} onDeleteExpense={handleDeleteExpense} />
//           <CategoryChart expenses={expensesWithCategory} categoryBudgets={categoryBudgets} />
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-border mt-16 py-6">
//         <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
//           <p>Track your expenses • Stay on budget • Achieve financial goals</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Index;
// // pages/Index.tsx
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import { BudgetOverview } from "@/components/BudgetOverview";
// import { BudgetSettings } from "@/components/BudgetSettings";
// import { AddExpenseForm } from "@/components/AddExpenseForm";
// import { ExpenseList } from "@/components/ExpenseList";
// import { CategoryChart } from "@/components/CategoryChart";
// import { Button } from "@/components/ui/button";
// import { Wallet, LogOut, Home } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// export interface Expense {
//   id: string;
//   user_id: string;
//   category_id: string;
//   amount: number;
//   note: string | null;
//   expense_date: string;
//   created_at: string;
//   categoryName?: string;
//   categoryIcon?: string;
// }

// export interface Category {
//   id: string;
//   user_id: string;
//   name: string;
//   icon: string | null;
//   created_at: string;
// }

// const API_BASE_URL = "http://localhost:5000/api";

// // Add this fetch function
// const fetchBudgets = async (userId: string) => {
//   const now = new Date();
//   const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
//     .toISOString()
//     .split("T")[0];
//   const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
//     .toISOString()
//     .split("T")[0];

//   const response = await fetch(
//     `${API_BASE_URL}/budgets?userId=${userId}&startDate=${startOfMonth}&endDate=${endOfMonth}`
//   );
//   const data = await response.json();
  
//   if (!data.success) throw new Error(data.error || "Failed to fetch budgets");
//   return data.data || [];
// };

// // Then in the component, add this query
// const {
//   data: budgets = [],
//   isLoading: budgetsLoading,
// } = useQuery({
//   queryKey: ["budgets", user?.id],
//   queryFn: () => fetchBudgets(user!.id),
//   enabled: !!user,
// });

// // And get the current budget
// const currentBudget = budgets[0] || { total_budget: 50000, category_limits: {} };
// const categoryLimits = currentBudget.category_limits || {};
// const fetchCategories = async (userId: string): Promise<Category[]> => {
//   const response = await fetch(`${API_BASE_URL}/categories?userId=${userId}`);
//   const data = await response.json();
  
//   if (!data.success) throw new Error(data.error || "Failed to fetch categories");
//   return data.data || [];
// };

// const fetchExpenses = async (userId: string): Promise<Expense[]> => {
//   const now = new Date();
//   const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
//     .toISOString()
//     .split("T")[0];
//   const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
//     .toISOString()
//     .split("T")[0];

//   const response = await fetch(
//     `${API_BASE_URL}/expenses?userId=${userId}&startDate=${startOfMonth}&endDate=${endOfMonth}`
//   );
//   const data = await response.json();
  
//   if (!data.success) throw new Error(data.error || "Failed to fetch expenses");
//   return data.data || [];
// };

// const createCategory = async (userId: string, name: string, icon: string): Promise<Category> => {
//   const response = await fetch(`${API_BASE_URL}/categories`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ userId, name, icon }),
//   });
//   const data = await response.json();
  
//   if (!data.success) throw new Error(data.error || "Failed to create category");
//   return data.data[0];
// };

// const createExpense = async (
//   userId: string,
//   categoryId: string,
//   amount: number,
//   note: string | null,
//   expenseDate: string
// ): Promise<Expense> => {
//   const response = await fetch(`${API_BASE_URL}/expenses`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       userId,
//       categoryId,
//       amount,
//       note,
//       expenseDate,
//     }),
//   });
//   const data = await response.json();
  
//   if (!data.success) throw new Error(data.error || "Failed to create expense");
//   return data.data[0];
// };

// const deleteExpense = async (expenseId: string): Promise<void> => {
//   const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
//     method: "DELETE",
//   });
//   const data = await response.json();
  
//   if (!data.success) throw new Error(data.error || "Failed to delete expense");
// };

// const Index = () => {
//   const { user, loading: authLoading, signOut } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   // Redirect if not logged in
//   useEffect(() => {
//     if (!authLoading && !user) {
//       navigate("/auth", { replace: true });
//     }
//   }, [user, authLoading, navigate]);

//   // Fetch data using React Query
//   const {
//     data: categories = [],
//     isLoading: categoriesLoading,
//     refetch: refetchCategories,
//   } = useQuery({
//     queryKey: ["categories", user?.id],
//     queryFn: () => fetchCategories(user!.id),
//     enabled: !!user,
//   });

//   const {
//     data: expenses = [],
//     isLoading: expensesLoading,
//     refetch: refetchExpenses,
//   } = useQuery({
//     queryKey: ["expenses", user?.id],
//     queryFn: () => fetchExpenses(user!.id),
//     enabled: !!user,
//   });

//   const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

//   // Map expenses to include category name for display
//   const expensesWithCategory = expenses.map((expense) => {
//     const category = categories.find((c) => c.id === expense.category_id);
//     return {
//       ...expense,
//       categoryName: category?.name || "Unknown",
//       categoryIcon: category?.icon || "📋",
//     };
//   });

//   const handleAddExpense = async (
//     categoryName: string,
//     amount: number,
//     note: string
//   ) => {
//     if (!user) return;

//     try {
//       let category = categories.find(
//         (c) => c.name.toLowerCase() === categoryName.toLowerCase()
//       );

//       if (!category) {
//         category = await createCategory(
//           user.id,
//           categoryName,
//           getCategoryIcon(categoryName)
//         );
//         queryClient.setQueryData(
//           ["categories", user.id],
//           [...categories, category]
//         );
//       }

//       await createExpense(
//         user.id,
//         category.id,
//         amount,
//         note || null,
//         new Date().toISOString().split("T")[0]
//       );

//       toast({
//         title: "Success",
//         description: `₹${amount.toLocaleString()} added to ${categoryName}`,
//       });
//       refetchExpenses();
//     } catch (error) {
//       toast({
//         title: "Error adding expense",
//         description: error instanceof Error ? error.message : "Unknown error",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDeleteExpense = async (id: string) => {
//     try {
//       await deleteExpense(id);
//       toast({
//         title: "Deleted",
//         description: "Expense removed successfully",
//       });
//       queryClient.setQueryData(
//         ["expenses", user?.id],
//         expenses.filter((e) => e.id !== id)
//       );
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to delete",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleSignOut = async () => {
//     await signOut();
//     navigate("/auth");
//   };

//   const getCategoryIcon = (name: string): string => {
//     const map: Record<string, string> = {
//       grocery: "🛒",
//       shopping: "🛍️",
//       utilities: "⚡",
//       car: "🚗",
//       food: "🍽️",
//       entertainment: "🎮",
//       health: "💊",
//       transport: "🚌",
//       other: "📋",
//     };
//     return map[name.toLowerCase()] || "📋";
//   };

//   if (authLoading || categoriesLoading || expensesLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
//           <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => navigate("/")}
//                 className="lg:hidden"
//               >
//                 <Home className="h-5 w-5" />
//               </Button>
//               <div className="flex items-center gap-3">
//                 <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80">
//                   <Wallet className="h-6 w-6 text-primary-foreground" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl font-bold text-foreground">Budget Tracker</h1>
//                   <p className="text-sm text-muted-foreground">
//                     Welcome back, {user.email?.split("@")[0]}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <BudgetSettings
//                 userId={user.id}
//                 categories={categories}
//                 onBudgetUpdate={() => {
//                   queryClient.invalidateQueries({
//                     queryKey: ["expenses", user.id],
//                   });
//                 }}
//               />
//               <Button variant="outline" onClick={handleSignOut} className="gap-2">
//                 <LogOut className="h-4 w-4" />
//                 <span className="hidden sm:inline">Sign Out</span>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8 space-y-10">
//         {/* Dynamic Budget Overview */}
//         <section>
//           <BudgetOverview />
//         </section>

//         {/* Add Expense */}
//         <section className="max-w-2xl mx-auto">
//           <AddExpenseForm onAddExpense={handleAddExpense} categories={categories} />
//         </section>

//         {/* Expenses + Chart */}
//         <section className="grid gap-8 lg:grid-cols-2">
//           <ExpenseList
//             expenses={expensesWithCategory}
//             onDeleteExpense={handleDeleteExpense}
//           />
//           <CategoryChart expenses={expensesWithCategory} categoryBudgets={{}} />
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-border mt-20 py-8">
//         <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
//           <p>Track smarter • Spend wiser • Save more</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Index;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BudgetOverview } from "@/components/BudgetOverview";
import { BudgetSettings } from "@/components/BudgetSettings";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { CategoryChart } from "@/components/CategoryChart";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface Expense {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  note: string | null;
  expense_date: string;
  created_at: string;
  categoryName?: string;
  categoryIcon?: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string | null;
  created_at: string;
}

const API_BASE_URL = "http://localhost:5001/api";

// API helper functions (outside component)
const fetchBudgets = async (userId: string) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const response = await fetch(
    `${API_BASE_URL}/budgets?userId=${userId}&startDate=${startOfMonth}&endDate=${endOfMonth}`
  );
  const data = await response.json();
  
  if (!data.success) throw new Error(data.error || "Failed to fetch budgets");
  return data.data || [];
};

const fetchCategories = async (userId: string): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/categories?userId=${userId}`);
  const data = await response.json();
  
  if (!data.success) throw new Error(data.error || "Failed to fetch categories");
  return data.data || [];
};

const fetchExpenses = async (userId: string): Promise<Expense[]> => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const response = await fetch(
    `${API_BASE_URL}/expenses?userId=${userId}&startDate=${startOfMonth}&endDate=${endOfMonth}`
  );
  const data = await response.json();
  
  if (!data.success) throw new Error(data.error || "Failed to fetch expenses");
  return data.data || [];
};

const createCategory = async (userId: string, name: string, icon: string): Promise<Category> => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, name, icon }),
  });
  const data = await response.json();
  
  if (!data.success) throw new Error(data.error || "Failed to create category");
  return data.data[0];
};

const createExpense = async (
  userId: string,
  categoryId: string,
  amount: number,
  note: string | null,
  expenseDate: string
): Promise<Expense> => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      categoryId,
      amount,
      note,
      expenseDate,
    }),
  });
  const data = await response.json();
  
  if (!data.success) throw new Error(data.error || "Failed to create expense");
  return data.data[0];
};

const deleteExpense = async (expenseId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  
  if (!data.success) throw new Error(data.error || "Failed to delete expense");
};

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    document.title = "Budget Tracker";
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Fetch budgets
  const {
    data: budgets = [],
    isLoading: budgetsLoading,
  } = useQuery({
    queryKey: ["budgets", user?.id],
    queryFn: () => fetchBudgets(user!.id),
    enabled: !!user,
  });

  // Fetch categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ["categories", user?.id],
    queryFn: () => fetchCategories(user!.id),
    enabled: !!user,
  });

  // Fetch expenses
  const {
    data: expenses = [],
    isLoading: expensesLoading,
    refetch: refetchExpenses,
  } = useQuery({
    queryKey: ["expenses", user?.id],
    queryFn: () => fetchExpenses(user!.id),
    enabled: !!user,
  });

  // Get current budget
  const currentBudget = budgets[0] || { total_budget: 50000, category_limits: {} };
  const monthlyBudget = currentBudget.total_budget || 50000;
  const categoryBudgets = currentBudget.category_limits || {};

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Map expenses to include category name for display
  const expensesWithCategory = expenses.map((expense) => {
    const category = categories.find((c) => c.id === expense.category_id);
    return {
      ...expense,
      categoryName: category?.name || "Unknown",
      categoryIcon: category?.icon || "📋",
    };
  });

  const handleAddExpense = async (
    categoryName: string,
    amount: number,
    note: string
  ) => {
    if (!user) return;

    try {
      let category = categories.find(
        (c) => c.name.toLowerCase() === categoryName.toLowerCase()
      );

      if (!category) {
        category = await createCategory(
          user.id,
          categoryName,
          getCategoryIcon(categoryName)
        );
        queryClient.setQueryData(
          ["categories", user.id],
          [...categories, category]
        );
      }

      await createExpense(
        user.id,
        category.id,
        amount,
        note || null,
        new Date().toISOString().split("T")[0]
      );

      toast({
        title: "Success",
        description: `₹${amount.toLocaleString()} added to ${categoryName}`,
      });
      refetchExpenses();
    } catch (error) {
      toast({
        title: "Error adding expense",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      toast({
        title: "Deleted",
        description: "Expense removed successfully",
      });
      queryClient.setQueryData(
        ["expenses", user?.id],
        expenses.filter((e) => e.id !== id)
      );
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete",
        variant: "destructive",
      });
    }
  };

const handleSignOut = async () => {
  try {
    // Clear all queries from cache
    queryClient.clear();
    
    // Sign out from auth
    await signOut();
    
    // Small delay to ensure state updates
    setTimeout(() => {
      navigate("/auth", { replace: true });
    }, 100);
  } catch (error) {
    toast({
      title: "Error signing out",
      description: error instanceof Error ? error.message : "Failed to sign out",
      variant: "destructive",
    });
  }
};

  const getCategoryIcon = (name: string): string => {
    const map: Record<string, string> = {
      grocery: "🛒",
      shopping: "🛍️",
      utilities: "⚡",
      car: "🚗",
      other: "📋",
    };
    return map[name.toLowerCase()] || "📋";
  };

  if (authLoading || categoriesLoading || expensesLoading || budgetsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="lg:hidden"
              >
                <Home className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80">
                  <Wallet className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Budget Tracker</h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {user.email?.split("@")[0]}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BudgetSettings
                userId={user.id}
                categories={categories}
                onBudgetUpdate={() => {
                  queryClient.invalidateQueries({
                    queryKey: ["budgets", user.id],
                  });
                }}
              />
              <Button variant="outline" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Budget Overview */}
        <section>
          <BudgetOverview />
        </section>

        {/* Add Expense */}
        <section className="max-w-2xl mx-auto">
          <AddExpenseForm onAddExpense={handleAddExpense} categories={categories} />
        </section>

        {/* Expenses + Chart */}
        <section className="grid gap-8 lg:grid-cols-2">
          <ExpenseList
            expenses={expensesWithCategory}
            onDeleteExpense={handleDeleteExpense}
          />
          <CategoryChart expenses={expensesWithCategory} categoryBudgets={categoryBudgets} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Track smarter • Spend wiser • Save more</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;