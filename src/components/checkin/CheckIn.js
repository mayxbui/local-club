import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../Firebase";
import { useUser } from "../contexts/UserContext";
import "./CheckIn.css";

const REGION_ID = "checkin-reader";
const POINT_OPTIONS = [5, 10, 20];
const COOLDOWN_MS = 60_000; // ignore the same code for a minute after a check-in

const CheckIn = () => {
  const { userDetails } = useUser();

  const [cameraError, setCameraError] = useState(null);
  const [phase, setPhase] = useState("scanning"); // scanning | review | success
  const [customer, setCustomer] = useState(null); // { uid, name, points }
  const [awarded, setAwarded] = useState(0);
  const [saving, setSaving] = useState(false);

  const scannerRef = useRef(null);
  const busyRef = useRef(false); // true while a result panel is showing
  const recentRef = useRef(new Map()); // uid -> timestamp of last check-in

  const handleDecoded = async (text) => {
    if (busyRef.current) return;
    const uid = (text || "").trim();
    if (!uid) return;

    const last = recentRef.current.get(uid);
    if (last && Date.now() - last < COOLDOWN_MS) {
      toast.info("That code was just checked in — give it a minute.");
      return;
    }

    busyRef.current = true;
    try {
      const snap = await getDoc(doc(db, "Users", uid));
      if (!snap.exists()) {
        toast.error("No member found for this code.");
        busyRef.current = false;
        return;
      }
      const data = snap.data();
      setCustomer({
        uid,
        name: data.name || "Member",
        points: typeof data.points === "number" ? data.points : 0,
      });
      setPhase("review");
    } catch (err) {
      console.error(err);
      toast.error("Lookup failed. Try again.");
      busyRef.current = false;
    }
  };

  useEffect(() => {
    const scanner = new Html5Qrcode(REGION_ID, { verbose: false });
    scannerRef.current = scanner;
    let cancelled = false;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: (vw, vh) => {
            const edge = Math.floor(Math.min(vw, vh, 320) * 0.8);
            return { width: edge, height: edge };
          },
        },
        handleDecoded,
        () => {} // per-frame decode failures are normal; ignore
      )
      .catch((err) => {
        if (!cancelled) setCameraError(err?.message || String(err));
      });

    return () => {
      cancelled = true;
      const s = scannerRef.current;
      if (s && s.isScanning) {
        s.stop()
          .then(() => s.clear())
          .catch(() => {});
      }
    };
  }, []);

  const award = async (amount) => {
    if (!customer || saving) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "Users", customer.uid), {
        points: increment(amount),
      });
      await addDoc(collection(db, "Checkins"), {
        uid: customer.uid,
        name: customer.name,
        points: amount,
        by: userDetails?.uid || null,
        at: serverTimestamp(),
      });
      recentRef.current.set(customer.uid, Date.now());
      setAwarded(amount);
      setPhase("success");
    } catch (err) {
      console.error(err);
      toast.error("Could not save points. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const scanNext = () => {
    setCustomer(null);
    setAwarded(0);
    setPhase("scanning");
    busyRef.current = false;
  };

  return (
    <div className="checkin">
      <header className="checkin__bar">
        <h1>Member Check-In</h1>
        <p>Scan a customer&rsquo;s Local Club code to add points</p>
      </header>

      <div className="checkin__stage">
        <div
          id={REGION_ID}
          className={`checkin__reader ${phase !== "scanning" ? "is-hidden" : ""}`}
        />

        {phase === "scanning" && cameraError && (
          <div className="checkin__panel checkin__panel--error">
            <p>Camera unavailable</p>
            <small>{cameraError}</small>
          </div>
        )}

        {phase === "review" && customer && (
          <div className="checkin__panel">
            <span className="checkin__eyebrow">Member found</span>
            <h2>{customer.name}</h2>
            <p className="checkin__balance">Balance: {customer.points} pts</p>
            <div className="checkin__points">
              {POINT_OPTIONS.map((n) => (
                <button key={n} disabled={saving} onClick={() => award(n)}>
                  +{n}
                </button>
              ))}
            </div>
            <button className="checkin__link" onClick={scanNext}>
              Cancel
            </button>
          </div>
        )}

        {phase === "success" && customer && (
          <div className="checkin__panel checkin__panel--ok">
            <div className="checkin__check">&#10003;</div>
            <h2>+{awarded} pts</h2>
            <p>
              {customer.name} now has <strong>{customer.points + awarded}</strong>{" "}
              pts
            </p>
            <button className="checkin__primary" onClick={scanNext}>
              Scan next customer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckIn;
