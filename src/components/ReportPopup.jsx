import React from "react";
import "./ReportPopup.css";

const ReportPopup = ({ pdfUrl, onClose }) => {
  return (
    <div className="report-popup-overlay">
      <div className="report-popup-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <iframe
          src={pdfUrl}
          title="Rapor PDF"
          width="100%"
          height="100%"
          frameBorder="0"
        />
      </div>
    </div>
  );
};

export default ReportPopup;
