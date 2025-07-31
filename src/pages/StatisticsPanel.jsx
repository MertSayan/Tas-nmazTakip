import React, { useEffect, useState ,useMemo } from 'react';
import axios from 'axios';
import './Statistics.css'; // ileride stil için kullanacağız
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { PieChart, Pie ,Cell } from 'recharts';

function StatisticsPanel() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

const monthlyInstallments = useMemo(() => {
  if (!statistics?.monthlyInstallmentCounts) return [];
  return Object.entries(statistics.monthlyInstallmentCounts).map(([month, count]) => ({ month, count }));
}, [statistics]);

const monthlyRentals = useMemo(() => {
  if (!statistics?.monthlyRentalCounts) return [];
  return Object.entries(statistics.monthlyRentalCounts).map(([month, count]) => ({ month, count }));
}, [statistics]);

useEffect(() => {
  const fetchStatistics = async () => {
    try {
      const response = await axios.get('https://localhost:7104/api/Statistics/Istatistics');
      setStatistics(response.data);
    } catch (error) {
      console.error("İstatistikler alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchStatistics();
}, []);


  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!statistics) {
    return <div>İstatistik verisi bulunamadı.</div>;
  }

  return (
    <div className="statistics-container">
      <h2>Kiralama İstatistik Paneli</h2>
      
<div className="kpi-dashboard">
  <div className="kpi-box box-blue">
    <div className="kpi-icon">🔢</div>
    <div className="kpi-number">{statistics.totalRentalCount}</div>
    <div className="kpi-label">Toplam Kiralama</div>
  </div>
  <div className="kpi-box box-cyan">
    <div className="kpi-icon">🆕</div>
    <div className="kpi-number">{statistics.newRentalsThisMonth}</div>
    <div className="kpi-label">Bu Ay Yapılan</div>
  </div>
  <div className="kpi-box box-green">
    <div className="kpi-icon">🟢</div>
    <div className="kpi-number">{statistics.activeRentals}</div>
    <div className="kpi-label">Aktif Kiralama</div>
  </div>
  <div className="kpi-box box-red">
    <div className="kpi-icon">🔴</div>
    <div className="kpi-number">{statistics.inactiveRentals}</div>
    <div className="kpi-label">Pasif Kiralama</div>
  </div>


    <div className="kpi-box box-dark">
  <div className="kpi-icon">💳</div>
  <div className="kpi-number">{statistics.totalPaidInstallments}</div>
  <div className="kpi-label">Ödenen Taksit</div>
  <div className="kpi-sub">({statistics.totalPaidAmount.toLocaleString()} ₺)</div>
</div>

<div className="kpi-box box-orange">
  <div className="kpi-icon">🧾</div>
  <div className="kpi-number">{statistics.unpaidInstallments}</div>
  <div className="kpi-label">Bekleyen Taksit</div>
  <div className="kpi-sub">({statistics.unpaidAmount.toLocaleString()} ₺)</div>
</div>

<div className="kpi-box box-yellow">
  <div className="kpi-icon">⏱️</div>
  <div className="kpi-number">{statistics.totalOverdueDays}</div>
  <div className="kpi-label">Geciken Gün Toplamı</div>
</div>

<div className="kpi-box box-pink">
  <div className="kpi-icon">⚠️</div>
  <div className="kpi-number">{statistics.penaltyAppliedCount}</div>
  <div className="kpi-label">Ceza Uygulanan Taksit</div>
  <div className="kpi-sub">({statistics.totalPenaltyAmount.toLocaleString()} ₺)</div>
</div>

<div className="kpi-box box-teal">
  <div className="kpi-icon">📆</div>
  <div className="kpi-number">{statistics.expiringSoonCount}</div>
  <div className="kpi-label">15 Güne Biten Kiralama</div>
</div>

<div className="kpi-box box-purple">
  <div className="kpi-icon">📏</div>
  <div className="kpi-number">
  {statistics.averageRentalDays.toFixed(2)}
  </div>  
  <div className="kpi-label">Ort. Kiralama Süresi (gün)</div>
</div>

<div className="kpi-box box-gold">
  <div className="kpi-icon">💰</div>
  <div className="kpi-number">{statistics.maxRentalAmount.toLocaleString()} ₺</div>
  <div className="kpi-label">En Yüksek Kira</div>
</div>

<div className="kpi-box box-gray">
  <div className="kpi-icon">📅</div>
  <div className="kpi-number">{statistics.installmentsDueToday}</div>
  <div className="kpi-label">Bugün Ödenecek Taksit</div>
</div>

<div className="kpi-box box-indigo">
  <div className="kpi-icon">🏠</div>
  <div className="kpi-number">{statistics.mostRentedPropertyType === 'Garden' ? 'Bahçe' : 'Dükkan'}</div>
  <div className="kpi-label">En Çok Kiralanan Tür</div>
</div>

</div>

      {/* Buraya ilerleyen adımlarda kartlar ve grafikler eklenecek */}
      <div className="charts-section">
        <h3 style={{ marginTop: "40px" }}>🌍 Bölgelere Göre Kiralama Dağılımı</h3>
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={Object.entries(statistics.rentalDistributionByRegion || {}).map(([region, count]) => ({
        name: region,
        value: count
      }))}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      {
        Object.entries(statistics.rentalDistributionByRegion || {}).map(([region], index) => (
          <Cell
            key={`cell-${index}`}
            fill={["#3498db", "#e67e22", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c"][index % 6]}
          />
        ))
      }
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>


  <div className="chart-row">
  <div className="chart-box">
    <h3>Aylara Göre Ödeme Sayısı</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={monthlyInstallments}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#3498db" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  <div className="chart-box">
    <h3>Aylara Göre Kiralama Sayısı</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={monthlyRentals}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#27ae60" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

</div>

{/* <div className="list-section">
  <h3>🏠 Aktif Kiralamalar</h3>
  <ul className="simple-list">
    {statistics.activeRental?.map((item, index) => (
      <li key={index}>
        <strong>{item.propertyName}</strong> → {item.citizenNationalId}
      </li>
    ))}
  </ul>

  <h3 style={{ marginTop: "30px" }}>👤 En Çok Kiralayan Vatandaşlar</h3>
  <table className="simple-table">
    <thead>
      <tr>
        <th>T.C. No</th>
        <th>Kiralama Sayısı</th>
      </tr>
    </thead>
    <tbody>
      {statistics.topCitizens?.map((c, index) => (
        <tr key={index}>
          <td>{c.nationalId}</td>
          <td>{c.rentalCount}</td>
        </tr>
      ))}
    </tbody>
  </table>

</div> */}

      {/* <pre style={{ background: "#f5f5f5", padding: "12px", borderRadius: "8px" }}>
        {JSON.stringify(statistics, null, 2)}
      </pre> */}
    </div>
  );
}

export default StatisticsPanel;
