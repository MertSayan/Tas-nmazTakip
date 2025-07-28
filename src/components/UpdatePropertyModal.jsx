import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './UpdatePropertyModal.css';

function UpdatePropertyModal({ propertyId, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 0,
    region: '',
    sizeSqm: 0,
    description: '',
    status: 0
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`https://localhost:7104/api/Properties/GetById?id=${propertyId}`);
        const data = response.data;
        setFormData({
          name: data.name,
          type: data.type === 'Shop' ? 1 : 0,
          region: data.region,
          sizeSqm: data.sizeSqm,
          description: data.description,
          status: data.status === 'Rented' ? 1 : 0
        });
      } catch {
        alert("Taşınmaz verileri alınamadı.");
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const userId = parseInt(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);

    const payload = {
      propertyId,
      ...formData,
      updatedByUserId: userId
    };
          console.log(payload);

    try {
      await axios.put('https://localhost:7104/api/Properties/Update', payload);
      onUpdated(); // tabloyu güncellemek için callback
      onClose(); // popup'u kapat
    } catch {
      alert("Güncelleme başarısız oldu.");
    }
  };

  return (
    <div className="update-modal-overlay">
      <div className="update-modal-content">
        <button className="cancel-btn" onClick={onClose}>X</button>
        <h3>Taşınmaz Güncelle</h3>
        <form onSubmit={handleSubmit}>
          <label>İsim:</label>
          <input type="text" placeholder="İsim" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          <label>Tür:</label>
          <select value={formData.type} onChange={e => setFormData({ ...formData, type: parseInt(e.target.value) })}>
            <option value={0}>Bahçe</option>
            <option value={1}>Dükkan</option>
          </select>
          <label>Bölge:</label>
          <input type="text" placeholder="Bölge" value={formData.region} onChange={e => setFormData({ ...formData, region: e.target.value })} required />
          <label>Metre kare:</label>
          <input type="number" placeholder="m²" value={formData.sizeSqm} onChange={e => setFormData({ ...formData, sizeSqm: parseInt(e.target.value) })} required />
          <label>Açıklama:</label>
          <textarea placeholder="Açıklama" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          <label>Durumu:</label>
          <select value={formData.status} onChange={e => setFormData({ ...formData, status: parseInt(e.target.value) })}>
            <option value={0}>Müsait</option>
            <option value={1}>Kirada</option>
          </select>
          <button type="submit" className="save-btn">Kaydet</button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePropertyModal;
