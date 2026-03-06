import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { QrCode, User, Heart, Phone, Shield, Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HealthData {
  fullName: string;
  age: string;
  bloodGroup: string;
  allergies: string;
  diseases: string;
  medications: string;
  insurance: string;
  address: string;
  contact1Name: string;
  contact1Phone: string;
  contact2Name: string;
  contact2Phone: string;
  contact3Name: string;
  contact3Phone: string;
}

const EmergencyQR = () => {
  const [formData, setFormData] = useState<HealthData>({
    fullName: "", age: "", bloodGroup: "", allergies: "", diseases: "",
    medications: "", insurance: "", address: "",
    contact1Name: "", contact1Phone: "",
    contact2Name: "", contact2Phone: "",
    contact3Name: "", contact3Phone: "",
  });
  const [generated, setGenerated] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: keyof HealthData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const qrValue = JSON.stringify({
    name: formData.fullName,
    age: formData.age,
    blood: formData.bloodGroup,
    allergies: formData.allergies,
    diseases: formData.diseases,
    meds: formData.medications,
    insurance: formData.insurance,
    addr: formData.address,
    emergency: [
      { n: formData.contact1Name, p: formData.contact1Phone },
      { n: formData.contact2Name, p: formData.contact2Phone },
      { n: formData.contact3Name, p: formData.contact3Phone },
    ].filter((c) => c.n || c.p),
  });

  const handleGenerate = () => {
    if (formData.fullName && formData.bloodGroup) {
      setGenerated(true);
    }
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 300, 300);
      const a = document.createElement("a");
      a.download = "healsync-emergency-qr.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full gradient-emergency px-4 py-2 text-sm font-bold text-emergency-foreground shadow-emergency">
            <AlertTriangle className="h-4 w-4" />
            TOP PRIORITY — Emergency Health Card
          </div>
          <h1 className="mb-2 text-4xl font-extrabold font-display lg:text-5xl">
            <span className="text-gradient">Emergency QR</span> Health Card
          </h1>
          <p className="text-xl font-semibold text-foreground/70 font-display">Scan Once, Save Life</p>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">Fill in your medical details below. When scanned, doctors can instantly access your critical health information during emergencies.</p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-6">
              {/* Personal Info */}
              <div>
                <div className="mb-4 flex items-center gap-2 text-primary">
                  <User className="h-5 w-5" />
                  <h3 className="text-lg font-bold font-display">Personal Information</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Full Name *</Label>
                    <Input placeholder="John Doe" value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
                  </div>
                  <div>
                    <Label>Age</Label>
                    <Input type="number" placeholder="25" value={formData.age} onChange={(e) => handleChange("age", e.target.value)} />
                  </div>
                  <div>
                    <Label>Blood Group *</Label>
                    <Select value={formData.bloodGroup} onValueChange={(v) => handleChange("bloodGroup", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input placeholder="City, State" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Medical Info */}
              <div>
                <div className="mb-4 flex items-center gap-2 text-emergency">
                  <Heart className="h-5 w-5" />
                  <h3 className="text-lg font-bold font-display">Medical Details</h3>
                </div>
                <div className="grid gap-4">
                  <div>
                    <Label>Allergies</Label>
                    <Textarea placeholder="e.g., Penicillin, Peanuts" rows={2} value={formData.allergies} onChange={(e) => handleChange("allergies", e.target.value)} />
                  </div>
                  <div>
                    <Label>Existing Diseases / Conditions</Label>
                    <Textarea placeholder="e.g., Diabetes, Hypertension" rows={2} value={formData.diseases} onChange={(e) => handleChange("diseases", e.target.value)} />
                  </div>
                  <div>
                    <Label>Current Medications</Label>
                    <Textarea placeholder="e.g., Metformin 500mg" rows={2} value={formData.medications} onChange={(e) => handleChange("medications", e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Insurance */}
              <div>
                <div className="mb-4 flex items-center gap-2 text-info">
                  <Shield className="h-5 w-5" />
                  <h3 className="text-lg font-bold font-display">Insurance Details</h3>
                </div>
                <Input placeholder="Policy number / Provider name" value={formData.insurance} onChange={(e) => handleChange("insurance", e.target.value)} />
              </div>

              {/* Emergency Contacts */}
              <div>
                <div className="mb-4 flex items-center gap-2 text-warning">
                  <Phone className="h-5 w-5" />
                  <h3 className="text-lg font-bold font-display">Emergency Contacts</h3>
                </div>
                {[1, 2, 3].map((num) => (
                  <div key={num} className="mb-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label>Contact {num} Name</Label>
                      <Input
                        placeholder={`Contact ${num} name`}
                        value={formData[`contact${num}Name` as keyof HealthData]}
                        onChange={(e) => handleChange(`contact${num}Name` as keyof HealthData, e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Contact {num} Phone</Label>
                      <Input
                        placeholder="+91 9876543210"
                        value={formData[`contact${num}Phone` as keyof HealthData]}
                        onChange={(e) => handleChange(`contact${num}Phone` as keyof HealthData, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={handleGenerate} size="lg" className="w-full gradient-emergency text-emergency-foreground font-bold text-base py-6 rounded-xl shadow-emergency hover:opacity-90 transition-opacity gap-2">
                <QrCode className="h-5 w-5" />
                Generate Emergency QR Code
              </Button>
            </div>
          </motion.div>

          {/* QR Preview */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-emergency/20 bg-card p-6 shadow-elevated text-center">
              <h3 className="mb-4 text-lg font-bold font-display">Your Emergency QR Card</h3>
              {generated ? (
                <div className="space-y-4">
                  <div ref={qrRef} className="mx-auto inline-block rounded-xl border-4 border-emergency/20 bg-card p-4">
                    <QRCodeSVG value={qrValue} size={200} level="M" bgColor="white" fgColor="#1a1a2e" />
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-left text-sm space-y-1">
                    <p className="font-semibold text-foreground">{formData.fullName}</p>
                    {formData.bloodGroup && <p className="text-emergency font-bold">Blood: {formData.bloodGroup}</p>}
                    {formData.age && <p className="text-muted-foreground">Age: {formData.age}</p>}
                    {formData.allergies && <p className="text-muted-foreground">Allergies: {formData.allergies}</p>}
                  </div>
                  <Button onClick={handleDownload} className="w-full gap-2 gradient-primary text-primary-foreground rounded-xl">
                    <Download className="h-4 w-4" />
                    Download QR Image
                  </Button>
                </div>
              ) : (
                <div className="py-12">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
                    <QrCode className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">Fill in your details and click Generate to create your Emergency QR Code.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyQR;
