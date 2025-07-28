import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs'; // query string'i düzgün oluşturmak için
import './Properties.css';
import RentalHistoryModal from '../components/RentalHistoryModal';



function Properties() {
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [data, setData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filtre değerlerini URL'den oku
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || '',
    region: searchParams.get("region") || '',
    sizeSqm: searchParams.get("sizeSqm") || '',
    status: searchParams.get("status") || '',
    name: searchParams.get("name") || ''
  });

  // API isteği
  const fetchData = async () => {
  try {
    const query = qs.stringify({
      PropertyType: filters.type || undefined,
      Region: filters.region || undefined,
      SizeSqm: filters.sizeSqm || undefined,
      PropertyStatus: filters.status || undefined,
      Name: filters.name || undefined
    });

    const response = await axios.get(`https://localhost:7104/api/Properties/FiltreliListele?${query}`);
    setData(response.data);
  } catch (err) {
    console.error(err);
    alert("Veriler çekilemedi!");
  }
};

  useEffect(() => {
    fetchData();
  }, [searchParams.toString()]); // URL değiştiğinde yeniden veriyi çek

  // Filtre butonuna basıldığında
  const handleFilter = () => {
    setSearchParams({
      type: filters.type,
      region: filters.region,
      sizeSqm: filters.sizeSqm,
      status: filters.status,
      name: filters.name
    });
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2>Taşınmazlar</h2>

      {/* Filtre Alanları */}
      <div className="filters">
  <input type="text" placeholder="İsim" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
  <input type="text" placeholder="Bölge" value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })} />
  <input type="number" placeholder="m²" value={filters.sizeSqm} onChange={(e) => setFilters({ ...filters, sizeSqm: e.target.value })} />
  <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
    <option value="">Tür Seçin</option>
    <option value="Garden">Bahçe</option>
    <option value="Shop">Dükkan</option>
  </select>
  <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
    <option value="">Durum Seçin</option>
    <option value="Available">Müsait</option>
    <option value="Rented">Kirada</option>
  </select>
  <button onClick={handleFilter} className="filter-btn">Filtrele</button>
</div>


      <br />

      {/* Tablo */}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>İsim</th>
            <th>Tür</th>
            <th>Durum</th>
            <th>Bölge</th>
            <th>m²</th>
            <th>Açıklama</th>
            <th>Oluşturma</th>
            <th>Oluşturan</th>
            <th>Güncelleme</th>
            <th>Güncelleyen</th>
          </tr>
        </thead>
        <tbody>
          {data.map((property) => (
            <tr key={property.propertyId}>
              <td>{property.propertyId}</td>
              <td>{property.name}</td>
              <td>{property.type}</td>
              <td>
                <span className={`status-${property.status}`}>
                    {property.status === 'Available' ? 'Müsait' : 'Kirada'}
                </span>
              </td>
              <td>{property.region}</td>
              <td>{property.sizeSqm}</td>
              <td>{property.description?.substring(0, 10)}...</td>
              <td>{new Date(property.createdAt).toLocaleDateString()}</td>
              <td>{property.createdByUserName}</td>
              <td>{property.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : '-'}</td>
              <td>{property.updatedByUserName || '-'}</td>
              <td>
                <button className="history-btn"
                  variant="contained"
                  color="info"
                  size="small"
                  style={{ textTransform: 'none' }}
                  onClick={() => setSelectedPropertyId(property.propertyId)}
                >
                  Kiralama Geçmişi
                </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
        {selectedPropertyId && (
  <RentalHistoryModal
    propertyId={selectedPropertyId}
    onClose={() => setSelectedPropertyId(null)}
  />
  )}
    </div>
  );
}
export default Properties;
