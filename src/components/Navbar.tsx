import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, X, User, AlertTriangle, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Guidance", path: "/guidance" },
  { label: "Symptom Checker", path: "/symptom-checker" },
  { label: "Hospital Finder", path: "/hospital-finder" },
  { label: "Expense Tracker", path: "/expense-tracker" },
  { label: "Insurance", path: "/insurance" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <QrCode className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-xl font-bold font-display text-gradient">HealSync</span>
            <p className="text-[10px] leading-none text-muted-foreground">Scan Once, Save Life</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/emergency-qr"
            className={`ml-1 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              location.pathname === "/emergency-qr"
                ? "gradient-emergency text-emergency-foreground shadow-emergency"
                : "border-2 border-emergency text-emergency hover:gradient-emergency hover:text-emergency-foreground animate-pulse-emergency"
            }`}
          >
            <QrCode className="h-4 w-4" />
            Emergency QR
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative hidden md:flex">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emergency" />
          </Button>
          <Link to="/emergency-qr" className="hidden md:flex">
            <Button variant="destructive" size="sm" className="gap-1.5 font-semibold">
              <AlertTriangle className="h-4 w-4" />
              Emergency
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border lg:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/emergency-qr"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg gradient-emergency py-3 text-sm font-bold text-emergency-foreground"
              >
                <QrCode className="h-4 w-4" />
                Emergency QR Card
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
