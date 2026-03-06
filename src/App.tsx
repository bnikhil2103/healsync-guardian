import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import EmergencyQR from "./pages/EmergencyQR";
import SymptomChecker from "./pages/SymptomChecker";
import Guidance from "./pages/Guidance";
import HospitalFinder from "./pages/HospitalFinder";
import ExpenseTracker from "./pages/ExpenseTracker";
import Insurance from "./pages/Insurance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/emergency-qr" element={<EmergencyQR />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/guidance" element={<Guidance />} />
          <Route path="/hospital-finder" element={<HospitalFinder />} />
          <Route path="/expense-tracker" element={<ExpenseTracker />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
