import { motion } from "framer-motion";
import { Shield, TrendingUp, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Insurance = () => {
  const totalCoverage = 200000;
  const usedPercent = 45;
  const usedAmount = totalCoverage * (usedPercent / 100);
  const remaining = totalCoverage - usedAmount;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-info/10 px-4 py-1.5 text-sm font-semibold text-info">
            <Shield className="h-4 w-4" />
            Coverage Tracker
          </div>
          <h1 className="mb-2 text-3xl font-extrabold font-display">Insurance Coverage</h1>
          <p className="text-muted-foreground">Monitor your insurance usage and remaining balance.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-8 shadow-elevated">
          <div className="grid gap-6 sm:grid-cols-3 mb-8">
            <div className="text-center rounded-xl bg-muted p-5">
              <p className="text-sm text-muted-foreground mb-1">Total Coverage</p>
              <p className="text-2xl font-extrabold font-display text-gradient">₹{totalCoverage.toLocaleString("en-IN")}</p>
            </div>
            <div className="text-center rounded-xl bg-warning/10 p-5">
              <p className="text-sm text-muted-foreground mb-1">Used ({usedPercent}%)</p>
              <p className="text-2xl font-extrabold font-display text-warning">₹{usedAmount.toLocaleString("en-IN")}</p>
            </div>
            <div className="text-center rounded-xl bg-success/10 p-5">
              <p className="text-sm text-muted-foreground mb-1">Remaining</p>
              <p className="text-2xl font-extrabold font-display text-success">₹{remaining.toLocaleString("en-IN")}</p>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Coverage Usage</span>
            <span className="font-bold">{usedPercent}%</span>
          </div>
          <Progress value={usedPercent} className="h-4 rounded-full" />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>₹0</span>
            <span>₹{totalCoverage.toLocaleString("en-IN")}</span>
          </div>

          <div className="mt-8 rounded-lg border border-info/20 bg-info/5 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-info shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Coverage Tip</p>
              <p className="text-sm text-muted-foreground">You have 55% coverage remaining. Consider using Jan Aushadhi generic medicines to reduce out-of-pocket expenses.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Insurance;
