import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Heart, Bell } from "lucide-react";

interface ReminderItem {
  medicineName: string;
  dosage: string;
  time: string;
  frequency: string;
  notes: string;
  linkedReport: string;
  taken: boolean;
}

const Dashboard = () => {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
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
          setReminders(data.medicineReminders || []);
        }
      } catch (error) {
        console.error("Error loading reminders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

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
      console.error("Error updating reminder:", error);
      alert("Failed to update reminder");
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Your health and medicine tracking overview
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-semibold">Health Status</h2>
            </div>
            <p className="mt-4 text-muted-foreground">
              Monitor your reports, reminders, and emergency information in one place.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-semibold">Reminder Summary</h2>
            </div>
            <p className="mt-4 text-3xl font-bold">{reminders.length}</p>
            <p className="text-muted-foreground">Total reminders saved</p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Taken Today</h2>
            <p className="mt-4 text-3xl font-bold">
              {reminders.filter((r) => r.taken).length}
            </p>
            <p className="text-muted-foreground">Marked as taken</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-lg space-y-4">
          <h2 className="text-2xl font-bold">Today’s Medicine Reminders</h2>

          {loading ? (
            <p className="text-muted-foreground">Loading reminders...</p>
          ) : reminders.length === 0 ? (
            <p className="text-muted-foreground">No medicine reminders added yet.</p>
          ) : (
            <div className="space-y-4">
              {reminders.map((reminder, index) => (
                <div
                  key={index}
                  className="rounded-xl border p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">{reminder.medicineName}</p>
                    <p className="text-sm text-muted-foreground">
                      Dosage: {reminder.dosage || "-"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Time: {reminder.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Frequency: {reminder.frequency || "-"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Notes: {reminder.notes || "-"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Linked Report: {reminder.linkedReport || "-"}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        reminder.taken
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {reminder.taken ? "Taken" : "Not Taken"}
                    </span>

                    <button
                      onClick={() => toggleTaken(index)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    >
                      Mark as {reminder.taken ? "Not Taken" : "Taken"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;