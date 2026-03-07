import { useEffect, useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface ProfileData {
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

interface ReportItem {
  name: string;
  url: string;
}

interface ReminderItem {
  medicineName: string;
  dosage: string;
  time: string;
  frequency: string;
  notes: string;
  linkedReport: string;
  taken: boolean;
}

const Profile = () => {
  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    age: "",
    bloodGroup: "",
    allergies: "",
    diseases: "",
    medications: "",
    insurance: "",
    address: "",
    contact1Name: "",
    contact1Phone: "",
    contact2Name: "",
    contact2Phone: "",
    contact3Name: "",
    contact3Phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [reminderForm, setReminderForm] = useState<ReminderItem>({
    medicineName: "",
    dosage: "",
    time: "",
    frequency: "",
    notes: "",
    linkedReport: "",
    taken: false,
  });

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReminderChange = (field: keyof ReminderItem, value: string | boolean) => {
    setReminderForm((prev) => ({ ...prev, [field]: value as never }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const docRef = doc(db, "userProfiles", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setFormData({
            fullName: data.fullName || "",
            age: data.age || "",
            bloodGroup: data.bloodGroup || "",
            allergies: data.allergies || "",
            diseases: data.diseases || "",
            medications: data.medications || "",
            insurance: data.insurance || "",
            address: data.address || "",
            contact1Name: data.contact1Name || "",
            contact1Phone: data.contact1Phone || "",
            contact2Name: data.contact2Name || "",
            contact2Phone: data.contact2Phone || "",
            contact3Name: data.contact3Name || "",
            contact3Phone: data.contact3Phone || "",
          });

          if (data.reports) {
            setReports(data.reports);
          }

          if (data.medicineReminders) {
            setReminders(data.medicineReminders);
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("User not logged in");
        return;
      }

      setSaving(true);

      await setDoc(
        doc(db, "userProfiles", user.uid),
        {
          ...formData,
          reports,
          medicineReminders: reminders,
          uid: user.uid,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadReport = async () => {
    try {
      const user = auth.currentUser;

      if (!user || !selectedFile) {
        alert("Select a report first");
        return;
      }

      setUploading(true);

      const storageRef = ref(
        storage,
        `medicalReports/${user.uid}/${Date.now()}_${selectedFile.name}`
      );

      await uploadBytes(storageRef, selectedFile);

      const url = await getDownloadURL(storageRef);

      const newReport = {
        name: selectedFile.name,
        url,
      };

      const updatedReports = [...reports, newReport];
      setReports(updatedReports);

      await setDoc(
        doc(db, "userProfiles", user.uid),
        { reports: updatedReports },
        { merge: true }
      );

      setSelectedFile(null);
      alert("Report uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const extractText = async (url: string) => {
    try {
      setExtracting(true);
      setExtractedText("");

      const response = await fetch("http://localhost:5000/extract-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ imageUrl: url })
      });

      const data = await response.json();

      if (data.success) {
        setExtractedText(data.text);
      } else {
        alert(data.message || "OCR failed");
      }
    } catch (error) {
      console.error("OCR error:", error);
      alert("OCR failed");
    } finally {
      setExtracting(false);
    }
  };

  const parsePrescriptionText = () => {
    if (!extractedText.trim()) {
      alert("No extracted text available");
      return;
    }

    const lines = extractedText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    let medicineName = "";
    let dosage = "";
    let notes = "";
    let frequency = "";

    for (const line of lines) {
      if (!medicineName) {
        const cleaned = line
          .replace(/^tab\.?/i, "")
          .replace(/^tablet\.?/i, "")
          .replace(/^cap\.?/i, "")
          .replace(/^capsule\.?/i, "")
          .trim();

        const dosageMatch = cleaned.match(/\b\d+\s?(mg|ml|g)\b/i);

        if (dosageMatch) {
          dosage = dosageMatch[0];
          medicineName = cleaned.replace(dosageMatch[0], "").trim();
        } else {
          medicineName = cleaned;
        }
      }

      if (
        line.includes("1-0-1") ||
        line.includes("1-1-1") ||
        line.toLowerCase().includes("daily") ||
        line.toLowerCase().includes("twice") ||
        line.toLowerCase().includes("thrice")
      ) {
        if (line.includes("1-0-1")) frequency = "Twice Daily";
        else if (line.includes("1-1-1")) frequency = "Thrice Daily";
        else if (line.toLowerCase().includes("twice")) frequency = "Twice Daily";
        else if (line.toLowerCase().includes("thrice")) frequency = "Thrice Daily";
        else if (line.toLowerCase().includes("daily")) frequency = "Daily";

        notes = line;
      }
    }

    setReminderForm((prev) => ({
      ...prev,
      medicineName: medicineName || prev.medicineName,
      dosage: dosage || prev.dosage,
      frequency: frequency || prev.frequency,
      notes: notes || prev.notes,
    }));

    alert("Reminder form auto-filled from OCR text");
  };

  const handleAddReminder = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("User not logged in");
        return;
      }

      if (!reminderForm.medicineName || !reminderForm.time) {
        alert("Please enter medicine name and time");
        return;
      }

      const updatedReminders = [...reminders, reminderForm];
      setReminders(updatedReminders);

      await setDoc(
        doc(db, "userProfiles", user.uid),
        { medicineReminders: updatedReminders },
        { merge: true }
      );

      setReminderForm({
        medicineName: "",
        dosage: "",
        time: "",
        frequency: "",
        notes: "",
        linkedReport: "",
        taken: false,
      });

      alert("Medicine reminder added");
    } catch (error) {
      console.error("Reminder save error:", error);
      alert("Failed to save reminder");
    }
  };

  const toggleTaken = async (index: number) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const updatedReminders = [...reminders];
      updatedReminders[index].taken = !updatedReminders[index].taken;

      setReminders(updatedReminders);

      await setDoc(
        doc(db, "userProfiles", user.uid),
        { medicineReminders: updatedReminders },
        { merge: true }
      );
    } catch (error) {
      console.error("Toggle reminder error:", error);
      alert("Failed to update reminder");
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-4xl rounded-2xl border bg-card p-6 shadow-lg space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">
            {formData.fullName ? formData.fullName : "Your Profile"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your health information and emergency details
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <input
              className="w-full rounded-lg border p-3"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Age</label>
            <input
              className="w-full rounded-lg border p-3"
              value={formData.age}
              onChange={(e) => handleChange("age", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Blood Group</label>
            <input
              className="w-full rounded-lg border p-3"
              value={formData.bloodGroup}
              onChange={(e) => handleChange("bloodGroup", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Insurance</label>
            <input
              className="w-full rounded-lg border p-3"
              value={formData.insurance}
              onChange={(e) => handleChange("insurance", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Address</label>
          <input
            className="w-full rounded-lg border p-3"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Allergies</label>
          <textarea
            className="w-full rounded-lg border p-3"
            rows={3}
            value={formData.allergies}
            onChange={(e) => handleChange("allergies", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Diseases / Conditions</label>
          <textarea
            className="w-full rounded-lg border p-3"
            rows={3}
            value={formData.diseases}
            onChange={(e) => handleChange("diseases", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Medications</label>
          <textarea
            className="w-full rounded-lg border p-3"
            rows={3}
            value={formData.medications}
            onChange={(e) => handleChange("medications", e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Emergency Contacts</h2>

          {[1, 2, 3].map((num) => (
            <div key={num} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Contact {num} Name</label>
                <input
                  className="w-full rounded-lg border p-3"
                  value={formData[`contact${num}Name` as keyof ProfileData] as string}
                  onChange={(e) =>
                    handleChange(`contact${num}Name` as keyof ProfileData, e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Contact {num} Phone</label>
                <input
                  className="w-full rounded-lg border p-3"
                  value={formData[`contact${num}Phone` as keyof ProfileData] as string}
                  onChange={(e) =>
                    handleChange(`contact${num}Phone` as keyof ProfileData, e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Medical Reports</h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />

            <button
              onClick={handleUploadReport}
              disabled={uploading}
              className="rounded-lg bg-green-600 text-white px-4 py-2"
            >
              {uploading ? "Uploading..." : "Upload Report"}
            </button>
          </div>

          {reports.length > 0 && (
            <div className="space-y-2">
              {reports.map((report, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="break-all">{report.name}</span>

                  <div className="flex gap-4">
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600"
                    >
                      View
                    </a>

                    <button
                      onClick={() => extractText(report.url)}
                      className="text-green-600"
                    >
                      Extract Text
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {extracting && (
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              Extracting text from prescription...
            </div>
          )}

          {extractedText && (
            <div className="rounded-lg border p-4 space-y-3">
              <div>
                <h3 className="mb-2 font-semibold">Extracted Prescription Text</h3>
                <pre className="whitespace-pre-wrap text-sm">{extractedText}</pre>
              </div>

              <button
                onClick={parsePrescriptionText}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
              >
                Use OCR for Reminder
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Medicine Reminder</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Medicine Name</label>
              <input
                className="w-full rounded-lg border p-3"
                value={reminderForm.medicineName}
                onChange={(e) => handleReminderChange("medicineName", e.target.value)}
                placeholder="e.g. Paracetamol"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Dosage</label>
              <input
                className="w-full rounded-lg border p-3"
                value={reminderForm.dosage}
                onChange={(e) => handleReminderChange("dosage", e.target.value)}
                placeholder="e.g. 500mg"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Time</label>
              <input
                type="time"
                className="w-full rounded-lg border p-3"
                value={reminderForm.time}
                onChange={(e) => handleReminderChange("time", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Frequency</label>
              <select
                className="w-full rounded-lg border p-3"
                value={reminderForm.frequency}
                onChange={(e) => handleReminderChange("frequency", e.target.value)}
              >
                <option value="">Select frequency</option>
                <option value="Daily">Daily</option>
                <option value="Twice Daily">Twice Daily</option>
                <option value="Thrice Daily">Thrice Daily</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Notes</label>
            <textarea
              className="w-full rounded-lg border p-3"
              rows={2}
              value={reminderForm.notes}
              onChange={(e) => handleReminderChange("notes", e.target.value)}
              placeholder="e.g. After food"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Linked Report</label>
            <select
              className="w-full rounded-lg border p-3"
              value={reminderForm.linkedReport}
              onChange={(e) => handleReminderChange("linkedReport", e.target.value)}
            >
              <option value="">Select report</option>
              {reports.map((report, index) => (
                <option key={index} value={report.name}>
                  {report.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddReminder}
            className="w-full rounded-lg bg-purple-600 p-3 text-white font-semibold"
          >
            Add Medicine Reminder
          </button>
        </div>

        {reminders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Saved Medicine Reminders</h2>

            {reminders.map((reminder, index) => (
              <div key={index} className="rounded-lg border p-4 space-y-2">
                <p><strong>Medicine:</strong> {reminder.medicineName}</p>
                <p><strong>Dosage:</strong> {reminder.dosage || "-"}</p>
                <p><strong>Time:</strong> {reminder.time}</p>
                <p><strong>Frequency:</strong> {reminder.frequency || "-"}</p>
                <p><strong>Notes:</strong> {reminder.notes || "-"}</p>
                <p><strong>Linked Report:</strong> {reminder.linkedReport || "-"}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={reminder.taken ? "text-green-600" : "text-red-600"}>
                    {reminder.taken ? "Taken" : "Not Taken"}
                  </span>
                </p>

                <button
                  onClick={() => toggleTaken(index)}
                  className="rounded-lg bg-orange-500 px-4 py-2 text-white"
                >
                  Mark as {reminder.taken ? "Not Taken" : "Taken"}
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-lg bg-blue-600 p-3 text-white font-semibold"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;