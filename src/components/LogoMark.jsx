import React, { useEffect, useState } from "react";
import stampMark from "../assets/logo.png";

export default function LogoMark({ className = "" }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] < 12 && data[i + 1] < 12 && data[i + 2] < 12) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setDataUrl(canvas.toDataURL("image/png"));
    };
    img.src = stampMark;
  }, []);

  return (
    <img
      className={className}
      src={dataUrl || stampMark}
      alt="WTFWERKS stamp"
    />
  );
}
