import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, TrendingDown, PieChart, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Simple, Smart, Free Budget Tracker
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            Take Control of Your Money
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track expenses, set monthly budgets, and achieve your financial goals — 
            all in one beautiful, easy-to-use app.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button
              size="lg"
              className="gap-3 text-lg px-8"
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
            >
              {user ? "Get Started" : "Get registered"}
              <ArrowRight className="h-5 w-5" />
            </Button>
            {/* {user && (
              <Button size="lg" variant="outline" onClick={() => navigate("/dashboard")}>
                Open App
              </Button>
            )} */}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Wallet className="h-10 w-10" />,
              title: "Track Expenses",
              desc: "Log every expense with just a few taps",
            },
            {
              icon: <PieChart className="h-10 w-10" />,
              title: "Visual Insights",
              desc: "See where your money goes with beautiful charts",
            },
            {
              icon: <TrendingDown className="h-10 w-10" />,
              title: "Stay Under Budget",
              desc: "Set limits and get warned before overspending",
            },
            {
              icon: <CheckCircle2 className="h-10 w-10" />,
              title: "100% Private",
              desc: "Your data belongs to you — always",
            },
          ].map((feature, i) => (
            <Card
              key={i}
              className="p-6 text-center hover:shadow-lg transition-all duration-300 border-border/50 bg-card/70 backdrop-blur-sm"
            >
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-5">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-card/50 border-t border-border/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Start Saving in 3 Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground">
              No complicated setup. Just results.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Sign Up (30 seconds)",
                desc: "Create your free account instantly",
              },
              {
                step: "2",
                title: "Set Your Budget",
                desc: "Tell us how much you want to spend this month",
              },
              {
                step: "3",
                title: "Track & Save",
                desc: "Add expenses and watch your savings grow",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Ready to Take Control?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands who are already saving more every month.
          </p>
          <Button
            size="lg"
            className="gap-3 text-lg px-10"
            onClick={() => navigate(user ? "/dashboard" : "/auth")}
          >
            {user ? "Open Your Dashboard" : "Start Tracking Free"}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Card>
      </section>

      {/* Footer */}
      {/* <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Budget Tracker • Built with care for your financial peace of mind</p>
        </div>
      </footer> */}
    </div>
  );
};

export default Welcome;