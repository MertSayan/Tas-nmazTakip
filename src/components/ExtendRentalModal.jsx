import React, { useState } from 'react';
import axios from 'axios';

export default function ExtendRentalModal({ rentalId, onClose, onSuccess }) {
  const [newEndDate, setNewEndDate] = useState('');
  const [additionalAmount, setAdditionalAmount] = useState('');
  const [paymentFrequencyOverride, setPaymentFrequencyOverride] = useState(''); // ''=mevcut kalsın, 0=Aylık, 1=Haftalık
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');

    if (!newEndDate) {
      setErr('Yeni bitiş tarihi zorunlu.');
      return;
    }
    if (additionalAmount === '' || isNaN(Number(additionalAmount)) || Number(additionalAmount) < 0) {
      setErr('Ek tutar 0 veya pozitif olmalı.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // diğer isteklerde yaptığın gibi
      const payload = {
        rentalId,
        newEndDate: new Date(newEndDate).toISOString(),
        additionalAmount: Number(additionalAmount),
        // boş bırakılırsa backend mevcut frekansı kullanır; sayı gönderilecekse Number(...)
        ...(paymentFrequencyOverride !== '' ? { paymentFrequencyOverride: Number(paymentFrequencyOverride) } : {})
      };

      await axios.put(
        'https://localhost:7104/api/Rentals/KiralamayıUzat',
        payload,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );

      onSuccess?.();
    } catch (e) {
      console.error(e);
      setErr('İşlem başarısız. Bilgileri kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-modal">
      <div className="report-content" style={{ maxWidth: 520 }}>
        <button className="cancel-btn" onClick={onClose}>✖</button>
        <h3>Kiralama Süresini Uzat</h3>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <label>
            Yeni Bitiş Tarihi
            <input
              type="date"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              required
            />
          </label>

          <label>
            Ek Tutar (₺)
            <input
              type="number"
              min="0"
              step="0.01"
              value={additionalAmount}
              onChange={(e) => setAdditionalAmount(e.target.value)}
              placeholder="0"
              required
            />
          </label>

          <label>
            Ödeme Periyodu (opsiyonel)
            <select
              value={paymentFrequencyOverride}
              onChange={(e) => setPaymentFrequencyOverride(e.target.value)}
            >
              <option value="">Mevcut periyot kalsın</option>
              <option value="0">Aylık</option>   {/* enum: 0=Monthly */}
              <option value="1">Haftalık</option> {/* enum: 1=Weekly */}
            </select>
          </label>

          {err && <div style={{ color: 'red' }}>{err}</div>}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn" onClick={onClose}>Vazgeç</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Gönderiliyor...' : 'Uzat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
