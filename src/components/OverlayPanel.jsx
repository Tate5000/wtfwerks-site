import React from "react";
import stampMark from "../assets/logo.png";

export default function OverlayPanel({ product, drop, sealed, onClose }) {
  if (!product) return null;
  const statusLabel = product.statusLabel || (product.soldOut ? "SOLD OUT" : "AVAILABLE");
  return (
    <div className="product-overlay">
      <div className="product-header">
        <div>
          <div className="product-title">{product.name}</div>
          <div className="product-sub">{drop?.dropName}</div>
        </div>
        <button type="button" onClick={onClose}>
          CLOSE
        </button>
      </div>
      <div className="product-meta">
        <div>PERSONALITY: {product.personalityName}</div>
        <div>{product.personalityTagline}</div>
        <div>DROP QUANTITY: {product.quantity}</div>
        <div>
          STATUS:{" "}
          <span className={statusLabel === "SOLD OUT" ? "sold" : "live"}>
            {statusLabel}
          </span>
        </div>
        <div>SERIAL: {product.serialFormat}</div>
      </div>
      <div className="product-actions">
        <button className="cta" type="button">
          Request Admission
        </button>
        <img className="stamp-mark" src={stampMark} alt="WTFWERKS stamp" />
      </div>
      {sealed && <div className="sealed">SEALED</div>}
    </div>
  );
}
