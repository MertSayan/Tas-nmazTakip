// src/components/ApplyIncreaseModal.jsx
import React, { useState } from "react";
import axios from "axios";

export default function ApplyIncreaseModal({ rentalId, onClose, onSuccess }) {
  const [percent, setPercent] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr("");
    const value = Number(percent);
    if (!Number.isFinite(value) || value <= 0) {
      setErr("Lütfen 0'dan büyük geçerli bir yüzde girin.");
      return;
    }
    try {
      setLoading(true);
      await axios.put("https://localhost:7104/api/PaymentInstallments/YillikZam", {
        rentalId,
        percent: value
      });
      onSuccess?.();   // listeyi yenilemek için dışarıya haber ver
    } catch (e) {
      setErr("İşlem sırasında bir hata oluştu.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-modal">
      <div className="report-content">
        <button className="cancel-btn" onClick={onClose} disabled={loading}>×</button>
        <h3>Zam Uygula</h3>
        <p><strong>Kiralama ID:</strong> {rentalId}</p>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
          <input
            type="number"
            placeholder="% oran"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", width: 140 }}
          />
          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading ? "Gönderiliyor..." : "Uygula"}
          </button>
          <button className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
            İptal
          </button>
        </div>
        {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
      </div>
    </div>
  );
}
