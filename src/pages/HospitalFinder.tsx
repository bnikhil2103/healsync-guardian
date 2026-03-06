import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Star, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const hospitals = [
  { name: "City General Hospital", type: "Government", distance: "2.3 km", rating: 4.2, phone: "+91 11 2345 6789", hours: "24/7", address: "MG Road, Sector 12" },
  { name: "Apollo Clinic", type: "Private", distance: "3.8 km", rating: 4.6, phone: "+91 11 3456 7890", hours: "8 AM - 10 PM", address: "Gandhi Nagar, Block B" },
  { name: "Primary Health Centre", type: "Government", distance: "1.1 km", rating: 3.8, phone: "+91 11 4567 8901", hours: "9 AM - 5 PM", address: "Village Road, Near Bus Stand" },
  { name: "LifeCare Hospital", type: "Private", distance: "5.2 km", rating: 4.4, phone: "+91 11 5678 9012", hours: "24/7", address: "NH-48, Industrial Area" },
  { name: "District Hospital", type: "Government", distance: "4.0 km", rating: 3.9, phone: "+91 11 6789 0123", hours: "24/7", address: "Civil Lines, Main Road" },
  { name: "MedPlus Clinic", type: "Private", distance: "2.7 km", rating: 4.1, phone: "+91 11 7890 1234", hours: "9 AM - 9 PM", address: "Market Road, Shop 14" },
];

const HospitalFinder = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <MapPin className="h-4 w-4" />
            Location-Based Search
          </div>
          <h1 className="mb-2 text-3xl font-extrabold font-display">Nearby Hospitals</h1>
          <p className="text-muted-foreground">Find hospitals and clinics near your location for quick access to medical care.</p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((h, i) => (
            <motion.div key={h.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <div className="group h-full rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition-all">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold font-display group-hover:text-primary transition-colors">{h.name}</h3>
                    <span className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${h.type === "Government" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                      {h.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-bold">{h.rating}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><Navigation className="h-3.5 w-3.5 text-primary" />{h.distance} away</p>
                  <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{h.address}</p>
                  <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{h.hours}</p>
                  <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{h.phone}</p>
                </div>
                <Button variant="outline" size="sm" className="mt-4 w-full gap-1.5 rounded-lg">
                  <Phone className="h-3.5 w-3.5" />
                  Call Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalFinder;
