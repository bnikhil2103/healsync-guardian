import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Calculator } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const spendingData = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 1800 },
  { month: "Mar", amount: 2400 },
  { month: "Apr", amount: 900 },
];

const treatments = [
  { name: "General Consultation", min: 200, max: 500 },
  { name: "Blood Test", min: 300, max: 1500 },
  { name: "X-Ray", min: 500, max: 2000 },
  { name: "MRI Scan", min: 3000, max: 8000 },
  { name: "Minor Surgery", min: 10000, max: 50000 },
  { name: "Dental Filling", min: 500, max: 3000 },
  { name: "Eye Checkup", min: 300, max: 1000 },
  { name: "Physiotherapy Session", min: 500, max: 2000 },
];

const ExpenseTracker = () => {
  const [selectedTreatment, setSelectedTreatment] = useState<string>("");

  const treatment = treatments.find((t) => t.name === selectedTreatment);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-extrabold font-display">Expense Tracker & Cost Estimator</h1>
          <p className="text-muted-foreground">Track healthcare spending and estimate upcoming treatment costs.</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Spending Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold font-display">
              <BarChart3 className="h-5 w-5 text-primary" />
              Monthly Healthcare Spending
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 20%, 90%)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v: number) => [`₹${v}`, "Spending"]} />
                <Line type="monotone" dataKey="amount" stroke="hsl(197, 71%, 43%)" strokeWidth={3} dot={{ fill: "hsl(197, 71%, 43%)", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Cost Estimator */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold font-display">
              <Calculator className="h-5 w-5 text-primary" />
              Treatment Cost Estimator
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">Select a treatment to see approximate cost ranges and prepare financially.</p>
            <Select value={selectedTreatment} onValueChange={setSelectedTreatment}>
              <SelectTrigger className="mb-4"><SelectValue placeholder="Select a treatment" /></SelectTrigger>
              <SelectContent>
                {treatments.map((t) => (
                  <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {treatment && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-muted p-5 text-center">
                <p className="text-sm text-muted-foreground mb-2">Estimated Cost Range</p>
                <p className="text-3xl font-extrabold font-display text-gradient">
                  ₹{treatment.min.toLocaleString()} – ₹{treatment.max.toLocaleString()}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">Actual costs may vary by location and hospital.</p>
              </motion.div>
            )}

            {!treatment && (
              <div className="rounded-lg bg-muted p-8 text-center">
                <Calculator className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Select a treatment above to see cost estimates.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
