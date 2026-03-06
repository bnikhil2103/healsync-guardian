import { motion } from "framer-motion";
import { Flame, Heart, Bug, Droplets, Zap, HandCoins, Building2, FileText, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const firstAidGuides = [
  { icon: Flame, title: "Burns", color: "text-emergency", steps: ["Cool the burn under running water for at least 10 minutes.", "Remove clothing/jewelry near the burn (unless stuck).", "Cover with a sterile, non-fluffy dressing or cling film.", "Do NOT apply ice, butter, or creams.", "Seek medical help for severe burns."] },
  { icon: Heart, title: "Heart Attack", color: "text-emergency", steps: ["Call emergency services immediately (112/108).", "Have the person sit down and rest in a comfortable position.", "Give aspirin (300mg) if available and not allergic.", "If unconscious, begin CPR: 30 chest compressions, 2 breaths.", "Use AED if available."] },
  { icon: Bug, title: "Snake Bite", color: "text-warning", steps: ["Keep the person calm and still.", "Immobilize the bitten limb below heart level.", "Remove jewelry/tight clothing near the bite.", "Do NOT suck venom, cut the wound, or apply a tourniquet.", "Get to the nearest hospital immediately."] },
  { icon: Droplets, title: "Bleeding", color: "text-emergency", steps: ["Apply firm pressure with a clean cloth or bandage.", "Keep pressure for at least 10 minutes without lifting.", "If blood soaks through, add more layers on top.", "Elevate the injured area above heart level if possible.", "Call emergency services for heavy or uncontrolled bleeding."] },
  { icon: Zap, title: "Fractures", color: "text-warning", steps: ["Keep the injured area still — do not try to realign.", "Apply a splint or padding to immobilize the area.", "Apply ice wrapped in cloth to reduce swelling.", "Do NOT give food or drink (in case surgery is needed).", "Transport to hospital carefully."] },
];

const govtSchemes = [
  { name: "Ayushman Bharat (PM-JAY)", desc: "Free health insurance up to ₹5 lakh/year for eligible families. Covers hospitalization, surgeries, and treatments at empaneled hospitals." },
  { name: "Pradhan Mantri Suraksha Bima Yojana", desc: "Accident insurance at ₹20/year covering ₹2 lakh for accidental death and disability." },
  { name: "Jan Aushadhi Scheme", desc: "Affordable generic medicines at up to 50-90% lower prices through Jan Aushadhi Kendras." },
  { name: "National Health Mission (NHM)", desc: "Free healthcare services in rural areas including maternal care, immunization, and disease control." },
  { name: "Rashtriya Swasthya Bima Yojana", desc: "Health insurance for BPL families covering hospitalization expenses up to ₹30,000/year." },
];

const Guidance = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-extrabold font-display">First Aid & Guidance</h1>
          <p className="text-muted-foreground text-lg">Emergency first aid instructions and government healthcare schemes.</p>
        </motion.div>

        {/* First Aid */}
        <div className="mb-12">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold font-display">
            <Flame className="h-6 w-6 text-emergency" />
            First Aid Guide
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {firstAidGuides.map((guide, i) => (
              <motion.div key={guide.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <div className="h-full rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow">
                  <div className="mb-3 flex items-center gap-2">
                    <guide.icon className={`h-5 w-5 ${guide.color}`} />
                    <h3 className="text-lg font-bold font-display">{guide.title}</h3>
                  </div>
                  <ol className="space-y-2">
                    {guide.steps.map((step, j) => (
                      <li key={j} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{j + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Govt Schemes */}
        <div>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold font-display">
            <HandCoins className="h-6 w-6 text-success" />
            Government Healthcare Schemes
          </h2>
          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <Accordion type="single" collapsible>
              {govtSchemes.map((scheme, i) => (
                <AccordionItem key={i} value={`scheme-${i}`}>
                  <AccordionTrigger className="px-5 hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success/10">
                        <Building2 className="h-4 w-4 text-success" />
                      </div>
                      <span className="font-bold font-display">{scheme.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-4">
                    <p className="text-muted-foreground ml-11">{scheme.desc}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidance;
