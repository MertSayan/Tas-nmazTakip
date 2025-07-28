import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RentalHistoryModal.css';

function RentalHistoryModal({ propertyId, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`https://localhost:7104/api/Rentals/KiralamaGeçmişi?propertyId=${propertyId}`);
        setHistory(response.data);
      } catch (err) {
        alert("Kiralama geçmişi alınamadı.");
      }
    };

    if (propertyId) fetchHistory();
  }, [propertyId]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h3>Kiralama Geçmişi</h3>

        <div className="history-scroll">
          {history.length > 0 ? (
            history.map((rental, index) => (
              <div key={index} style={{ marginBottom: '25px' }}>
                <p><strong>T.C.:</strong> {rental.citizenNationalId}</p>
                <p><strong>Başlangıç:</strong> {new Date(rental.startDate).toLocaleDateString()}</p>
                <p><strong>Bitiş:</strong> {new Date(rental.endDate).toLocaleDateString()}</p>

                <h4>Taksitler:</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr>
                      <th>Vade Tarihi</th>
                      <th>Tutar</th>
                      <th>Durum</th>
                      <th>Not</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rental.installments.map((inst, i) => (
                      <tr key={i}>
                        <td>{new Date(inst.dueDate).toLocaleDateString()}</td>
                        <td>{inst.amount} ₺</td>
                        <td style={{ color: inst.notes?.toLocaleLowerCase('tr-TR').includes("iptal") ? 'red' : 'black' }}>
                          {inst.notes?.toLocaleLowerCase('tr-TR').includes("iptal") ? "İPTAL" : "Bekliyor"}
                        </td>
                        <td className="notes-cell">{inst.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>Kiralama geçmişi bulunamadı.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RentalHistoryModal;
