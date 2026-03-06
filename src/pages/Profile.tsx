import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, "userProfiles", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data() as ProfileData);
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

      await setDoc(doc(db, "userProfiles", user.uid), {
        ...formData,
        uid: user.uid,
        email: user.email || "",
        updatedAt: new Date().toISOString()
      });

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-4xl rounded-2xl border bg-card p-6 shadow-lg space-y-6">
        <h1 className="text-3xl font-bold">Manage Profile</h1>

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