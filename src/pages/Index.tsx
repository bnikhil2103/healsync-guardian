import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  QrCode, Activity, Heart, MapPin, BarChart3, Shield, Calculator,
  PieChart, HandCoins, ArrowRight, Zap, Phone, Stethoscope, Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: QrCode, title: "Emergency QR Card", desc: "Store critical medical info in a scannable QR code for instant access during emergencies.", link: "/emergency-qr", highlight: true },
  { icon: Activity, title: "Symptom Checker", desc: "Enter symptoms and get possible conditions with basic medical guidance.", link: "/symptom-checker" },
  { icon: Flame, title: "First Aid Guide", desc: "Step-by-step emergency first aid instructions for burns, fractures, bites & more.", link: "/guidance" },
  { icon: MapPin, title: "Hospital Finder", desc: "Find nearby hospitals and clinics with distance, ratings and contact info.", link: "/hospital-finder" },
  { icon: BarChart3, title: "Expense Tracker", desc: "Track monthly healthcare spending with visual charts and budgeting tools.", link: "/expense-tracker" },
  { icon: Shield, title: "Insurance Tracker", desc: "Monitor your insurance coverage usage and remaining balance in real time.", link: "/insurance" },
  { icon: Calculator, title: "Cost Estimator", desc: "Estimate treatment costs to financially prepare before hospital visits.", link: "/expense-tracker" },
  { icon: PieChart, title: "Health Risk Predictor", desc: "Assess your health risk based on age, habits and conditions with visual charts.", link: "/dashboard" },
  { icon: HandCoins, title: "Govt Schemes", desc: "Discover government healthcare schemes and financial assistance programs.", link: "/guidance" },
];

const stats = [
  { value: "10L+", label: "Lives Impacted" },
  { value: "500+", label: "Hospitals Connected" },
  { value: "24/7", label: "Emergency Access" },
  { value: "₹0", label: "Cost to Users" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emergency/10 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 py-20 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emergency/30 bg-emergency/10 px-4 py-1.5 text-sm font-semibold text-emergency">
                <Zap className="h-4 w-4" />
                Emergency-First Healthcare Platform
              </div>
              <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight lg:text-7xl font-display">
                <span className="text-gradient">HealSync</span>
              </h1>
              <p className="mb-2 text-2xl font-bold text-foreground/80 lg:text-3xl font-display">
                Scan Once, Save Life
              </p>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                Smart healthcare guidance, financial tracking, and emergency preparedness — all in one platform designed for underserved communities.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/emergency-qr">
                <Button size="lg" className="gradient-emergency text-emergency-foreground shadow-emergency gap-2 text-base font-bold px-8 py-6 rounded-xl hover:opacity-90 transition-opacity">
                  <QrCode className="h-5 w-5" />
                  Generate Emergency QR
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="gap-2 text-base font-semibold px-8 py-6 rounded-xl border-2">
                  Open Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Emergency QR Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-16 max-w-lg"
          >
            <div className="relative rounded-2xl border border-emergency/20 bg-card p-6 shadow-elevated">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-emergency px-4 py-1 text-xs font-bold text-emergency-foreground">
                ⚡ TOP PRIORITY FEATURE
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl gradient-emergency shadow-emergency animate-float">
                  <QrCode className="h-8 w-8 text-emergency-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold font-display">Emergency Health QR Card</h3>
                  <p className="text-sm text-muted-foreground">Store blood type, allergies, medications & emergency contacts in one scannable code.</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  { icon: Heart, label: "Medical Info" },
                  { icon: Phone, label: "3 Contacts" },
                  { icon: Stethoscope, label: "Doctor Access" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-muted p-2">
                    <item.icon className="mx-auto mb-1 h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-extrabold text-gradient font-display">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-3 text-3xl font-bold font-display lg:text-4xl">Everything You Need</h2>
          <p className="text-muted-foreground text-lg">Healthcare guidance, financial tools, and emergency readiness in one unified platform.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={f.link}>
                <div
                  className={`group relative h-full rounded-xl border p-6 transition-all hover:shadow-elevated ${
                    f.highlight
                      ? "border-emergency/30 bg-emergency/5 hover:border-emergency/50"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  {f.highlight && (
                    <span className="absolute -top-2.5 right-4 rounded-full gradient-emergency px-3 py-0.5 text-[10px] font-bold text-emergency-foreground">
                      TOP PRIORITY
                    </span>
                  )}
                  <div
                    className={`mb-4 inline-flex rounded-lg p-2.5 ${
                      f.highlight ? "gradient-emergency" : "gradient-primary"
                    }`}
                  >
                    <f.icon className={`h-5 w-5 ${f.highlight ? "text-emergency-foreground" : "text-primary-foreground"}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold font-display group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground font-display">Ready to Protect Your Health?</h2>
          <p className="mb-8 text-primary-foreground/80 text-lg">Generate your Emergency QR Health Card now — it takes less than 2 minutes.</p>
          <Link to="/emergency-qr">
            <Button size="lg" className="bg-card text-foreground hover:bg-card/90 gap-2 text-base font-bold px-8 py-6 rounded-xl">
              <QrCode className="h-5 w-5" />
              Create Your QR Card
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <QrCode className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-display text-gradient">HealSync</span>
          </div>
          <p className="text-sm text-muted-foreground">Scan Once, Save Life — Empowering rural & underserved communities with smart healthcare.</p>
          <p className="mt-4 text-xs text-muted-foreground">© 2026 HealSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
