import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs'; // query string'i düzgün oluşturmak için
import './Properties.css';
import RentalHistoryModal from '../components/RentalHistoryModal';
import AddPropertyModal from '../components/AddPropertyModal';
import UpdatePropertyModal from '../components/UpdatePropertyModal'; // yolun doğru olduğundan emin ol
import RentPropertyModal from '../components/RentPropertyModal';
import { useNavigate } from 'react-router-dom';



function Properties() {
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [data, setData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUpdatePropertyId, setSelectedUpdatePropertyId] = useState(null);

  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [selectedRentPropertyId, setSelectedRentPropertyId] = useState(null);

  const handleOpenRentModal = (propertyId) => {
  setSelectedRentPropertyId(propertyId);
  setIsRentModalOpen(true);
};
const navigate = useNavigate();

  // Filtre değerlerini URL'den oku
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || '',
    region: searchParams.get("region") || '',
    sizeSqm: searchParams.get("sizeSqm") || '',
    status: searchParams.get("status") || '',
    name: searchParams.get("name") || '',
    blockNumber:searchParams.get("blockNumber") || '',
    parcelNumber:searchParams.get("parcelNumber") || '',
  });

  // API isteği
  const fetchData = async () => {
  try {
    const query = qs.stringify({
      PropertyType: filters.type || undefined,
      Region: filters.region || undefined,
      SizeSqm: filters.sizeSqm || undefined,
      PropertyStatus: filters.status || undefined,
      Name: filters.name || undefined,
      BlockNumber:filters.blockNumber || undefined,
      ParcelNumber:filters.parcelNumber || undefined
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
      name: filters.name,
      blockNumber:filters.blockNumber,
      parcelNumber:filters.parcelNumber
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Taşınmazlar</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
      {/* Filtre Alanları */}
      <div className="filters">
        <input type="text" placeholder="İsim" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input type="text" placeholder="Ada" value={filters.blockNumber} onChange={(e) => setFilters({ ...filters, blockNumber: e.target.value })} />
        <input type="text" placeholder="Parsel" value={filters.parcelNumber} onChange={(e) => setFilters({ ...filters, parcelNumber: e.target.value })} />
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

      <button 
        type="button"  // ← Bu satırı ekle!
        onClick={() => setIsAddModalOpen(true)} 
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
        + Taşınmaz Ekle
      </button>

      <button
        type="button"
        onClick={() => navigate("/rentals")}
        style={{
          padding: '8px 16px',
          backgroundColor: '#890f92ff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
      >
        Kiralamalar
      </button>

</div>
      <br />

      {/* Tablo */}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>İsim</th>
            <th>Ada/Parsel</th>
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
              <td>{property.blockNumber} / {property.parcelNumber}</td>
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
                  onClick={() => setSelectedPropertyId(property.propertyId)}>
                  Kiralama Geçmişi
                </button>

                 <button
                  className="update-btn"
                  onClick={() => {
                    setSelectedUpdatePropertyId(property.propertyId);
                    setIsUpdateModalOpen(true);
                  }}>
                  Güncelle
                </button>
                <button
                  className="rent-btn"
                  disabled={property.status !== "Available"}
                  onClick={() => handleOpenRentModal(property.propertyId)}
                >
                  Kirala
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
        {isAddModalOpen && (
        <AddPropertyModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchData} // başarılı ekleme sonrası tabloyu güncellemek için
        />
        )}

        {isUpdateModalOpen && selectedUpdatePropertyId && (
          <UpdatePropertyModal
            propertyId={selectedUpdatePropertyId}
            onClose={() => {
              setIsUpdateModalOpen(false);
              setSelectedUpdatePropertyId(null);
            }}
            onUpdated={() => {
              fetchData(); // tabloyu yeniden getir
            }}
          />
        )}

        {isRentModalOpen && selectedRentPropertyId && (
          <RentPropertyModal
            propertyId={selectedRentPropertyId}
            onClose={() => {
              setIsRentModalOpen(false);
              setSelectedRentPropertyId(null);
            }}
            onSuccess={fetchData}
          />
        )}
    </div>
  );
}
export default Properties;
