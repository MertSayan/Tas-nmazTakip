// AddPropertyModal.jsx
import React, { useState } from 'react';
import './AddPropertyModal.css';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AddPropertyModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    region: '',
    sizeSqm: '',
    description: '',
    blockNumber:'',
    parcelNumber:''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const createdByUserId = Number(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);

      const payload = {
        ...formData,
        type: parseInt(formData.type),
        sizeSqm: parseFloat(formData.sizeSqm),
        createdByUserId: createdByUserId
      };
      
      console.log(payload);
      

      await axios.post('https://localhost:7104/api/Properties/Create', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Taşınmaz başarıyla eklendi!');
      onSuccess();
        onClose();
    } catch (err) {
      console.error(err);
      alert('Taşınmaz eklenirken hata oluştu.');
    }
  };

  return (
    <div className="add-modal-overlay">
      <div className="add-modal">
        <h2>Yeni Taşınmaz Ekle</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>İsim:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Tür:</label>
          <select name="type" value={formData.type} onChange={handleChange} required>
            <option value="">Tür Seçin</option>
            <option value="0">Bahçe/Arazi/Arsa</option>
            <option value="1">Dükkan</option>
          </select>

          {formData.type === "0" && (
            <div className="ada-parsel-row">
              <div className="ada-parsel-item">
                <label>Ada:</label>
                <input
                  type="text"
                  name="blockNumber"
                  value={formData.blockNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="ada-parsel-item">
                <label>Parsel:</label>
                <input
                  type="text"
                  name="parcelNumber"
                  value={formData.parcelNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}


          <label>Bölge:</label>
          <input type="text" name="region" value={formData.region} onChange={handleChange} required />

          <label>m²:</label>
          <input type="number" name="sizeSqm" value={formData.sizeSqm} onChange={handleChange} required />

         

          <label>Açıklama:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />

          <div className="modal-actions">
            <button type="submit">Ekle</button>
            <button type="button" onClick={onClose} className="cancel-btn">İptal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal;
