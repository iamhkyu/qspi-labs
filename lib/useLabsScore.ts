"use client";

import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirestoreDb } from "./firebase";

/** Firestore qspi-crt/labs 문서의 score 필드 (반도체 MOMENTUM 점수, number) */
export function useLabsScore() {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const db = getFirestoreDb();
    if (!db) {
      setLoading(false);
      return;
    }

    const fetchLabs = async () => {
      try {
        const labsRef = doc(db, "qspi-crt", "labs");
        const snap = await getDoc(labsRef);
        const data = snap.data();
        if (snap.exists() && data && typeof data.score === "number") {
          setScore(data.score);
        } else {
          setScore(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setScore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, []);

  return { score, loading, error };
}
