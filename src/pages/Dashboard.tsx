import { motion } from "framer-motion";
import { DollarSign, Shield, Heart, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const spendingData = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 1800 },
  { month: "Mar", amount: 2400 },
  { month: "Apr", amount: 900 },
];

const riskData = [
  { name: "Low Risk", value: 55, color: "hsl(152, 55%, 45%)" },
  { name: "Medium Risk", value: 30, color: "hsl(40, 90%, 50%)" },
  { name: "High Risk", value: 15, color: "hsl(0, 80%, 55%)" },
];

const summaryCards = [
  { icon: DollarSign, label: "Total Healthcare Expenses", value: "₹18,450", color: "primary", emoji: "💰" },
  { icon: Shield, label: "Insurance Remaining", value: "₹1,20,000", color: "info", emoji: "🛡" },
  { icon: Heart, label: "Health Risk Score", value: "Low", color: "success", emoji: "❤️" },
  { icon: BarChart3, label: "Upcoming Medical Costs", value: "₹5,000", color: "warning", emoji: "📊" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl font-extrabold font-display">Health + Finance Dashboard</h1>
          <p className="mb-8 text-muted-foreground">Your comprehensive health and financial overview at a glance.</p>
        </motion.div>

        {/* Summary Cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-2xl">{card.emoji}</span>
                <div className={`rounded-lg p-2 ${card.color === "primary" ? "bg-primary/10" : card.color === "info" ? "bg-info/10" : card.color === "success" ? "bg-success/10" : "bg-warning/10"}`}>
                  <card.icon className={`h-5 w-5 ${card.color === "primary" ? "text-primary" : card.color === "info" ? "text-info" : card.color === "success" ? "text-success" : "text-warning"}`} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold font-display">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 text-lg font-bold font-display">Monthly Healthcare Spending</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 20%, 90%)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v: number) => [`₹${v}`, "Spending"]} />
                <Bar dataKey="amount" fill="hsl(197, 71%, 43%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 text-lg font-bold font-display">Health Risk Assessment</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {riskData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex justify-center gap-4 text-xs">
              {riskData.map((r) => (
                <div key={r.name} className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full" style={{ background: r.color }} />
                  <span className="text-muted-foreground">{r.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
