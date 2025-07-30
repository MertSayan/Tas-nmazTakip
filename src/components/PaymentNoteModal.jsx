// 1. Popup bileşeni: PaymentNoteModal.jsx
import React, { useState } from 'react';
import './PaymentNoteModal.css';
import axios from 'axios';

function PaymentNoteModal({ installmentId, onClose, onSuccess }) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.put('https://localhost:7104/api/PaymentInstallments', {
        installmentId: installmentId,
        notes: note || null
      });
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      alert("Ödeme işaretleme başarısız oldu.");
      setLoading(false);
    }
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <h3>Ödeme İşaretleme</h3>
        <p>Bu taksidi "Ödendi" olarak işaretlemek istiyor musunuz?</p>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="İsteğe bağlı not (opsiyonel)"
          rows={3}
        />

        <div className="payment-modal-actions">
          <button onClick={onClose} className="cancel-btn">Vazgeç</button>
          <button onClick={handleSubmit} className="submit-btn" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentNoteModal;
