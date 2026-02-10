import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import stampMark from "../assets/logo.png";

const APP_STORE_URL = "https://apps.apple.com/app/id0000000000";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.wtfwerks.app";

function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function buildQrDataUrl(value) {
  const size = 240;
  const cell = 16;
  const grid = 15;
  let svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' shape-rendering='crispEdges'>`;
  svg += "<rect width='100%' height='100%' fill='#0a0d10'/>";
  const seed = value.length;
  for (let y = 0; y < grid; y += 1) {
    for (let x = 0; x < grid; x += 1) {
      const on = (x * 17 + y * 31 + seed) % 5 === 0;
      if (on) {
        svg += `<rect x='${x * cell + 8}' y='${y * cell + 8}' width='${cell - 2}' height='${cell - 2}' fill='#41f2a6'/>`;
      }
    }
  }
  svg += "</svg>";
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function AppDownload() {
  const qrDataUrl = useMemo(() => buildQrDataUrl("wtfwerks-app"), []);

  useEffect(() => {
    if (!isMobile()) return;
    const isApple = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    window.location.href = isApple ? APP_STORE_URL : PLAY_STORE_URL;
  }, []);

  return (
    <div className="app app-download">
      <header className="topbar">
        <div className="logo">
          <img src={stampMark} alt="WTFWERKS stamp" />
          <span>WTFWERKS</span>
        </div>
        <Link className="back-link" to="/">
          Back
        </Link>
      </header>

      <main className="download-hero">
        <div className="download-card">
          <div className="download-title">GET THE APP</div>
          <div className="download-sub">
            Scan on desktop or tap a store on mobile.
          </div>
          <img className="download-qr" src={qrDataUrl} alt="WTFWERKS app QR" />
          <div className="download-actions">
            <a
              className="product-card__cta"
              href={APP_STORE_URL}
              target="_blank"
              rel="noreferrer"
            >
              App Store
            </a>
            <a
              className="product-card__cta ghost"
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noreferrer"
            >
              Google Play
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
