import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './Rentals.css';
import PaymentNoteModal from '../components/PaymentNoteModal'; // eklemeyi unutma
import { useNavigate } from "react-router-dom";
import ReportPopup from '../components/ReportPopup';
import ApplyIncreaseModal from '../components/ApplyIncreaseModal';
import { jwtDecode } from "jwt-decode";
import ExtendRentalModal from '../components/ExtendRentalModal';

import {
  FaIdCard, FaPhone, FaCalendarAlt,
  FaUser, FaMapMarkerAlt, FaWarehouse, FaCheckCircle
} from 'react-icons/fa';
import { Fa0, FaApple, FaCircleStop } from 'react-icons/fa6';



function getCurrentUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = jwtDecode(token);
  // AddPropertyModal.jsx’de yaptığın claim:
  const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  return Number(id);
}


function Rentals() {
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [extendRentalId, setExtendRentalId] = useState(null);

  const [isIncreaseModalOpen, setIsIncreaseModalOpen] = useState(false);
  const [increaseRentalId, setIncreaseRentalId] = useState(null);

  const [pdfUrl, setPdfUrl] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [reportRentalId, setReportRentalId] = useState(null);
  const [rentals, setRentals] = useState([]);
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [filters, setFilters] = useState({
    propertyType: '',
    region: '',
    citizenNationalId: '',
    startDate: '',
    endDate: '',
    isActive: ''
    
  });
  const [selectedInstallmentId, setSelectedInstallmentId] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);


  const fetchRentals = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.propertyType) params.append('PropertyType', filters.propertyType);
      if (filters.region) params.append('Region', filters.region);
      if (filters.citizenNationalId) params.append('CitizenNationalId', filters.citizenNationalId);
      if (filters.startDate) params.append('StartDate', filters.startDate);
      if (filters.endDate) params.append('EndDate', filters.endDate);
      if (filters.isActive) params.append('IsActive',filters.isActive);

      const response = await axios.get(`https://localhost:7104/api/Rentals/KiralamalariGör?${params.toString()}`);
      setRentals(response.data);
    } catch (error) {
      console.error("Veri alınamadı", error);
    }
  }, [filters]);

  async function cancelRental(rentalId) {
  const token = localStorage.getItem("token");
  const cancelByUserId = getCurrentUserId();
  if (!token || !cancelByUserId) {
    console.error("Token veya kullanıcı bilgisi bulunamadı.");
    return;
  }

  try {
    await axios.put(
      "https://localhost:7104/api/Rentals/Kiralamaİptali",
      { rentalId, cancelByUserId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchRentals(); // işlem sonrası listeyi yeniler
  } catch (err) {
    console.error("Kiralama iptali başarısız:", err);
  }
}


  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const translateType = (type) => {
    return type === "Garden" ? "Bahçe" : "Dükkan";
  };

  return (
    <div className="rentals-container">
      <h2>Kiralama Listesi</h2>

      <div className="filters">
        <select value={filters.propertyType} onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}>
          <option value="">Tür</option>
          <option value="Garden">Bahçe</option>
          <option value="Shop">Dükkan</option>
        </select>
        <input type="text" placeholder="Bölge" value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })} />
        <input type="text" placeholder="T.C." value={filters.citizenNationalId} onChange={(e) => setFilters({ ...filters, citizenNationalId: e.target.value })} />
        <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
        <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
        <label>
          Sadece aktifler
          <input
            type="checkbox"
            checked={filters.isActive === true}
            onChange={(e) =>
              setFilters({ ...filters, isActive: e.target.checked ? true : null })
            }
          />
        </label>
        <button onClick={fetchRentals}>Filtrele</button>
        <button className="btn-primary" onClick={() => navigate('/properties')}>
        Taşınmazlar
        </button>
        <button className="btn-primary" onClick={() => navigate('/statistics')}>
        İstatistikler
        </button>
        
      </div>

      {rentals.map((rental) => (
        <div key={rental.rentalId} className="rental-card">
          <div className="rental-header">
            <div><FaWarehouse className="icon purple" /> <strong>{rental.propertyName}</strong> - {translateType(rental.propertyType)}</div>
            <div><FaMapMarkerAlt className="icon green" /> {rental.region}</div>
            <div><FaIdCard className="icon blue" /> {rental.citizenNationalId}</div>
            {/* <div><FaPhone className="icon orange" /> {rental.citizenPhoneNumber}</div> */}
            {/* <div><FaUser className="icon pink" /> {rental.citizenFullName}</div> */}
            <div><FaCalendarAlt className="icon red" /> {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}</div>
            {/* <div><FaUser className="icon teal" /> {rental.createdEmployee}</div> */}
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                // wwwroot’tan sonrasını ayıkla
                const relativePath = rental.reportPath.split("wwwroot")[1]?.replace(/\\/g, "/");

                // Tarayıcının erişebileceği full URL oluştur
                const url = `https://localhost:7104${relativePath}`;

                setPdfUrl(url);       // iframe'e verilecek olan kaynak bu
                setShowPopup(true);   // popup aç
              }}
            >
              📄 Rapor Al
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setIncreaseRentalId(rental.rentalId);
                setIsIncreaseModalOpen(true);
              }}
            >
              💹 Zam Uygula
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => cancelRental(rental.rentalId)}
              title="Bu kiralamayı iptal et"
            >
              Kiralamayı İptal Et
            </button>
            <div>
              {rental.isActive ? (
                <><FaCheckCircle className="icon yellow" /> Aktif</>
              ) : (
                <><FaCircleStop className="icon red" /> Pasif</>
              )}
            </div>
            
            

            <button className="toggle-btn" onClick={() => handleToggle(rental.rentalId)}>
              {expandedId === rental.rentalId ? "▲" : "▼"}
            </button>
          </div>

          {expandedId === rental.rentalId && (
            <div className="installments-section">
              <div className="rental-header">
                <div><FaPhone className="icon orange" /> Telefon Numarası: {rental.citizenPhoneNumber}</div> 
                <div><FaUser className="icon pink" /> Kiracı: {rental.citizenFullName}</div> 
                <div><FaUser className="icon teal" /> Kiralamayı Olusturan Personel: {rental.createdEmployee}</div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <button
                  className="btn btn-outline-secondary"
                  disabled={!rental.isActive}               // pasif kiralamada kapalı
                  title={rental.isActive ? 'Süreyi uzat' : 'Kiralama pasif'}
                  onClick={() => {
                    setExtendRentalId(rental.rentalId);
                    setIsExtendModalOpen(true);
                  }}
                >
                  ⏱ Kiralama Süresini Uzat
                </button>
              </div>

              <table className="installments-table">
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
                      <td>
                        {inst.amount.toLocaleString()} ₺
                        {inst.totalPenalty && parseFloat(inst.totalPenalty.replace(",", ".")) > 0 && (
                          <span style={{
                            color: inst.isPaid ? "green" : "red",
                            fontWeight: "bold",
                            marginLeft: "6px",
                            fontSize: "13px"
                          }}>
                            +{parseFloat(inst.totalPenalty.replace(",", ".")).toLocaleString('tr-TR')} ₺ gecikme
                          </span>
                        )}
                      </td>
                      <td style={{ color: inst.notes?.toLowerCase().includes("iptal") ? 'red' : 'black' }}>
                        {inst.notes?.toLowerCase().includes("iptal") ? 'İPTAL' : (inst.isPaid ? 'Ödendi' : 'Bekliyor')}
                      </td>
                      <td className="notes-cell">{inst.notes}</td>
                      <td>
                        <button
                          disabled={inst.isPaid || !rental.isActive}
                          title={
                            !rental.isActive
                              ? 'Kiralama pasif: ödeme kapalı'
                              : inst.isPaid
                              ? 'Taksit zaten ödendi'
                              : 'Ödeme yap'
                          }
                          onClick={() => {
                            setSelectedInstallmentId(inst.paymentInstallmentId);
                            setIsPaymentModalOpen(true);
                          }}
                          style={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            backgroundColor: (inst.isPaid || !rental.isActive) ? '#ccc' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: (inst.isPaid || !rental.isActive) ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Ödeme İşlemi
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
      {isPaymentModalOpen && selectedInstallmentId && (
        <PaymentNoteModal 
          installmentId={selectedInstallmentId}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedInstallmentId(null);
          }}
          onSuccess={() => {
            // Ödeme başarıyla kaydedildiğinde yeniden veri çek veya sayfayı yenile
            fetchRentals(); 
            setIsPaymentModalOpen(false);
            setSelectedInstallmentId(null);
          }}
        />
      )}
      {reportRentalId && (
        <ReportPopup rentalId={reportRentalId} onClose={() => setReportRentalId(null)} />
      )}
      {showPopup && (
        <ReportPopup pdfUrl={pdfUrl} onClose={() => setShowPopup(false)} />
      )}

      {isIncreaseModalOpen && increaseRentalId && (
        <ApplyIncreaseModal
          rentalId={increaseRentalId}
          onClose={() => {
            setIsIncreaseModalOpen(false);
            setIncreaseRentalId(null);
          }}
          onSuccess={() => {
            // başarı sonrası listeyi yenile
            fetchRentals();
            setIsIncreaseModalOpen(false);
            setIncreaseRentalId(null);
          }}
        />
      )}

      {isExtendModalOpen && extendRentalId && (
        <ExtendRentalModal
          rentalId={extendRentalId}
          onClose={() => {
            setIsExtendModalOpen(false);
            setExtendRentalId(null);
          }}
          onSuccess={() => {
            fetchRentals();
            setIsExtendModalOpen(false);
            setExtendRentalId(null);
          }}
        />
      )}

    </div>
    
  );
}

export default Rentals;
