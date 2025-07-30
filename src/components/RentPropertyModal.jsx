import React, { useState } from 'react';
import axios from 'axios';
import './RentPropertyModal.css';
import { jwtDecode } from 'jwt-decode';


const RentPropertyModal = ({ propertyId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    citizenNationalId: '',
    citizenPhoneNumber: '',
    startDate: '',
    endDate: '',
    paymentFrequency: '',
    totalAmount: '',
    contractFilePath: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = Number(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);

    const payload = {
      propertyId: propertyId,
      citizenNationalId: formData.citizenNationalId,
      citizenPhoneNumber: formData.citizenPhoneNumber,
      startDate: formData.startDate,
      endDate: formData.endDate,
      paymentFrequency: parseInt(formData.paymentFrequency),
      totalAmount: parseFloat(formData.totalAmount),
      contractFilePath: formData.contractFilePath,
      createdByUserId: parseInt(userId)
    };
    console.log(payload);

    try {
      await axios.post("https://localhost:7104/api/Rentals/Kirala", payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Kiralama başarıyla tamamlandı!");
      onClose();
      onSuccess(); // tabloyu yenile
    } catch (err) {
      console.error(err);
      alert("Kiralama işlemi başarısız!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Taşınmaz Kiralama</h3>
        <form onSubmit={handleSubmit}>
          <input name="citizenNationalId" placeholder="Vatandaş TC" onChange={handleChange} required />
          <input name="citizenPhoneNumber" placeholder="Telefon" onChange={handleChange} required />
          <input type="datetime-local" name="startDate" onChange={handleChange} required />
          <input type="datetime-local" name="endDate" onChange={handleChange} required />
          <select name="paymentFrequency" onChange={handleChange} required>
            <option value="">Ödeme Sıklığı</option>
            <option value="0">Haftalık</option>
            <option value="1">Aylık</option>
          </select>
          <input type="number" name="totalAmount" placeholder="Toplam Tutar" onChange={handleChange} required />
          <input name="contractFilePath" placeholder="Kontrat Dosyası" onChange={handleChange} required />
          <br />
          <button type="submit">Kaydet</button>
          <button type="button" onClick={onClose}>İptal</button>
        </form>
      </div>
    </div>
  );
};

export default RentPropertyModal;
