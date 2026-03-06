import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import EmergencyQR from "./pages/EmergencyQR";
import EmergencyView from "./pages/EmergencyView";
import SymptomChecker from "./pages/SymptomChecker";
import Guidance from "./pages/Guidance";
import HospitalFinder from "./pages/HospitalFinder";
import ExpenseTracker from "./pages/ExpenseTracker";
import Insurance from "./pages/Insurance";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const ProtectedRoute = ({ user, children }: { user: User | null; children: JSX.Element }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {currentUser && <Navbar />}

          <Routes>
            <Route
              path="/"
              element={
                currentUser ? <Index /> : <Navigate to="/login" replace />
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={currentUser}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/emergency-qr"
              element={
                <ProtectedRoute user={currentUser}>
                  <EmergencyQR />
                </ProtectedRoute>
              }
            />

            <Route path="/emergency/:id" element={<EmergencyView />} />

            <Route
              path="/symptom-checker"
              element={
                <ProtectedRoute user={currentUser}>
                  <SymptomChecker />
                </ProtectedRoute>
              }
            />

            <Route
              path="/guidance"
              element={
                <ProtectedRoute user={currentUser}>
                  <Guidance />
                </ProtectedRoute>
              }
            />

            <Route
              path="/hospital-finder"
              element={
                <ProtectedRoute user={currentUser}>
                  <HospitalFinder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/expense-tracker"
              element={
                <ProtectedRoute user={currentUser}>
                  <ExpenseTracker />
                </ProtectedRoute>
              }
            />

            <Route
              path="/insurance"
              element={
                <ProtectedRoute user={currentUser}>
                  <Insurance />
                </ProtectedRoute>
              }
            />

            <Route
              path="/login"
              element={
                currentUser ? <Navigate to="/" replace /> : <Login />
              }
            />

            <Route
              path="/signup"
              element={
                currentUser ? <Navigate to="/" replace /> : <Signup />
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute user={currentUser}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;