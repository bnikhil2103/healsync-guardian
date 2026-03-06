import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const symptomsList = ["Fever", "Cough", "Headache", "Fatigue", "Nausea", "Chest Pain", "Shortness of Breath", "Body Aches", "Sore Throat", "Dizziness", "Diarrhea", "Rash"];

const conditionDB: Record<string, { conditions: string[]; advice: string; severity: "low" | "medium" | "high" }> = {
  "Fever,Cough": { conditions: ["Common Cold", "Flu", "COVID-19"], advice: "Rest, drink fluids, monitor temperature. Seek help if fever exceeds 103°F.", severity: "medium" },
  "Fever,Headache": { conditions: ["Viral Infection", "Malaria", "Dengue"], advice: "Stay hydrated, take OTC pain relief. Visit a doctor if symptoms persist beyond 3 days.", severity: "medium" },
  "Chest Pain": { conditions: ["Anxiety", "Acid Reflux", "Heart Condition"], advice: "If pain is severe or accompanied by breathlessness, seek immediate medical attention.", severity: "high" },
  "Headache,Fatigue": { conditions: ["Stress", "Dehydration", "Anemia"], advice: "Ensure adequate sleep, hydration, and balanced diet. Consult a doctor if chronic.", severity: "low" },
  "Nausea,Diarrhea": { conditions: ["Food Poisoning", "Gastroenteritis"], advice: "Stay hydrated with ORS. Avoid solid food for a few hours. Seek help if symptoms persist.", severity: "medium" },
};

const SymptomChecker = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<typeof conditionDB[string] | null>(null);

  const toggle = (s: string) => setSelected((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const check = () => {
    const key = selected.sort().join(",");
    const match = Object.entries(conditionDB).find(([k]) => {
      const kArr = k.split(",");
      return kArr.every((s) => selected.includes(s));
    });
    setResult(match ? match[1] : { conditions: ["General Discomfort"], advice: "Monitor your symptoms. If they worsen or persist for more than 48 hours, consult a healthcare professional.", severity: "low" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <Activity className="h-4 w-4" />
            AI-Powered Analysis
          </div>
          <h1 className="mb-2 text-3xl font-extrabold font-display">Symptom Checker</h1>
          <p className="text-muted-foreground">Select your symptoms below to get possible conditions and medical advice.</p>
        </motion.div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card mb-6">
          <h3 className="mb-4 font-bold font-display flex items-center gap-2"><Search className="h-4 w-4 text-primary" /> Select Your Symptoms</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {symptomsList.map((s) => (
              <button
                key={s}
                onClick={() => toggle(s)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all border ${
                  selected.includes(s) ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <Button onClick={check} disabled={selected.length === 0} className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5">
            Analyze Symptoms
          </Button>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl border p-6 shadow-card ${result.severity === "high" ? "border-emergency/30 bg-emergency/5" : result.severity === "medium" ? "border-warning/30 bg-warning/5" : "border-success/30 bg-success/5"}`}>
            <div className="mb-4 flex items-center gap-2">
              {result.severity === "high" ? <AlertTriangle className="h-5 w-5 text-emergency" /> : <CheckCircle className="h-5 w-5 text-success" />}
              <h3 className="text-lg font-bold font-display">Analysis Result</h3>
              <Badge variant={result.severity === "high" ? "destructive" : "secondary"} className="ml-auto">
                {result.severity.toUpperCase()} RISK
              </Badge>
            </div>
            <div className="mb-3">
              <p className="text-sm font-semibold text-muted-foreground mb-1">Possible Conditions:</p>
              <div className="flex flex-wrap gap-2">
                {result.conditions.map((c) => (
                  <Badge key={c} variant="outline" className="text-foreground">{c}</Badge>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-semibold mb-1">Medical Advice:</p>
              <p className="text-sm text-muted-foreground">{result.advice}</p>
            </div>
            <p className="mt-4 text-xs text-muted-foreground italic">⚠️ This is not a medical diagnosis. Always consult a qualified healthcare professional.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;
