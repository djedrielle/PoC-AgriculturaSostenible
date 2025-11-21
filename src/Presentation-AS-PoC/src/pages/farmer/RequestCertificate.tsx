import React, { useState } from "react";
import { requestCertificate } from "@/api";

export function RequestCertificateSection() {
  const [userId, setUserId] = useState("");
  const [institutionId, setInstitutionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await requestCertificate({
        user_id: userId,
        institution_id: institutionId,
      });
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 8 }}>Request Certificate</h3>

      <div style={{ display: "grid", gap: 8, maxWidth: 400 }}>
        <input
          placeholder="User ID (producer)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <input
          placeholder="Institution ID"
          value={institutionId}
          onChange={(e) => setInstitutionId(e.target.value)}
        />

        <button
          type="button"
          onClick={handleClick}
          disabled={loading || !userId || !institutionId}
        >
          {loading ? "Requesting..." : "Request Certificate"}
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>Error: {error}</p>
      )}

      {result && (
        <pre
          style={{
            marginTop: 10,
            background: "#f4f4f4",
            padding: 12,
            borderRadius: 8,
            maxHeight: 250,
            overflow: "auto",
            fontSize: 12,
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}