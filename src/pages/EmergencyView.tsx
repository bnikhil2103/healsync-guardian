import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertTriangle, Phone, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BasicProfile {
  id: string;
  fullName: string;
  age: string;
  bloodGroup: string;
  contact1Name: string;
  contact1Phone: string;
}

interface FullProfile extends BasicProfile {
  allergies: string;
  diseases: string;
  medications: string;
  insurance: string;
  address: string;
  contact2Name: string;
  contact2Phone: string;
  contact3Name: string;
  contact3Phone: string;
}

const EmergencyView = () => {
  const { id } = useParams();

  const [basicData, setBasicData] = useState<BasicProfile | null>(null);
  const [fullData, setFullData] = useState<FullProfile | null>(null);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {
    const fetchBasicProfile = async () => {
      try {
        await fetch("http://localhost:5000/scan-log", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: id,
            location: "Unknown"
          })
        });

        const response = await fetch(`http://localhost:5000/profile/${id}`);
        const data = await response.json();

        if (data.success) {
          setBasicData(data);
        } else {
          alert("Profile not found");
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load emergency profile");
      } finally {
        setLoading(false);
      }
    };

    fetchBasicProfile();
  }, [id]);

  const handleSendOtp = async () => {
    if (!basicData?.contact1Phone) {
      alert("No emergency contact number available");
      return;
    }

    try {
      setSendingOtp(true);

      const response = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phoneNumber: basicData.contact1Phone
        })
      });

      const data = await response.json();

      if (data.success) {
        alert("OTP sent successfully to emergency contact");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!basicData?.contact1Phone) {
      alert("Emergency contact number missing");
      return;
    }

    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setVerifyingOtp(true);

      const otpResponse = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phoneNumber: basicData.contact1Phone,
          otp
        })
      });

      const otpData = await otpResponse.json();

      if (otpData.success) {
        setVerified(true);

        const fullResponse = await fetch(`http://localhost:5000/profile-full/${id}`);
        const fullProfileData = await fullResponse.json();

        if (fullProfileData.success) {
          setFullData(fullProfileData);
        } else {
          alert("Failed to load full profile");
        }
      } else {
        alert("Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      alert("OTP verification failed");
    } finally {
      setVerifyingOtp(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-lg">
        Loading emergency profile...
      </div>
    );
  }

  if (!basicData) {
    return (
      <div className="p-10 text-center text-lg">
        No emergency profile found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-lg space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-600 font-bold">
            <AlertTriangle className="h-4 w-4" />
            Emergency Health Card
          </div>

          <h1 className="text-3xl font-bold">Patient Emergency Information</h1>
          <p className="text-muted-foreground mt-2">
            Basic medical details available immediately
          </p>
        </div>

        <div className="rounded-xl bg-muted p-4 space-y-2">
          <p><strong>Name:</strong> {basicData.fullName}</p>
          <p><strong>Age:</strong> {basicData.age}</p>
          <p><strong>Blood Group:</strong> {basicData.bloodGroup}</p>
          <p>
            <strong>Emergency Contact:</strong> {basicData.contact1Name} - {basicData.contact1Phone}
          </p>
        </div>

        <a href={`tel:${basicData.contact1Phone}`}>
          <Button className="w-full">
            <Phone className="mr-2 h-4 w-4" />
            Call Emergency Contact
          </Button>
        </a>

        {!verified && (
          <div className="rounded-xl border border-border p-4 space-y-3">
            <h2 className="font-semibold text-lg">Unlock Full Medical Record</h2>
            <p className="text-sm text-muted-foreground">
              Send OTP to emergency contact and verify to access full patient medical history.
            </p>

            <Button
              onClick={handleSendOtp}
              className="w-full"
              disabled={sendingOtp}
            >
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </Button>

            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <Button
              onClick={handleVerifyOtp}
              className="w-full"
              disabled={verifyingOtp}
            >
              {verifyingOtp ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        )}

        {verified && fullData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-500">
              <Heart className="h-5 w-5" />
              <h2 className="text-xl font-bold">Full Medical Details</h2>
            </div>

            <div className="rounded-xl bg-muted p-4 space-y-2">
              <p><strong>Allergies:</strong> {fullData.allergies || "None"}</p>
              <p><strong>Diseases:</strong> {fullData.diseases || "None"}</p>
              <p><strong>Medications:</strong> {fullData.medications || "None"}</p>
              <p><strong>Insurance:</strong> {fullData.insurance || "Not provided"}</p>
              <p><strong>Address:</strong> {fullData.address || "Not provided"}</p>
            </div>

            <div className="flex items-center gap-2 text-blue-500">
              <Shield className="h-5 w-5" />
              <h2 className="text-xl font-bold">All Emergency Contacts</h2>
            </div>

            <div className="rounded-xl bg-muted p-4 space-y-2">
              <p><strong>Contact 1:</strong> {fullData.contact1Name || "-"} - {fullData.contact1Phone || "-"}</p>
              <p><strong>Contact 2:</strong> {fullData.contact2Name || "-"} - {fullData.contact2Phone || "-"}</p>
              <p><strong>Contact 3:</strong> {fullData.contact3Name || "-"} - {fullData.contact3Phone || "-"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyView;