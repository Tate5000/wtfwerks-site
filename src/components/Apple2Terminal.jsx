import React, { useMemo, useState } from "react";
import { drops } from "../data/drops.js";

const liveDrop = drops.find((drop) => drop.status === "LIVE");

const files = [
  { id: "README", title: "README" },
  ...((liveDrop?.products || []).map((product) => ({
    id: product.id,
    title: `${product.name}.TXT`,
    product,
  }))),
];

const readmeBody = [
  "WTFWERKS // OPEN PIPELINE NOTICE",
  "",
  "WE DO NOT KEEP YOUR MF DATA.",
  "NO STORAGE. NO SALE.",
  "MEMORY LIVES IN YOUR CONVO PIPELINE", 
  "AND IN-APP ONLY WHERE YOU SET IT.",
  "",
  "ALL SPECS ARE LOCAL TO THIS SESSION.",
  ""
].join("\n");

export default function Apple2Terminal({ onClose }) {
  const [activeFile, setActiveFile] = useState(files[0]);

  const fileBody = useMemo(() => {
    if (activeFile.id === "README") return readmeBody;
    if (!activeFile.product) return "";
    const product = activeFile.product;
    return [
      `${product.name} // TECH SPEC`,
      "",
      `PERSONALITY: ${product.personalityName}`,
      `${product.personalityTagline}`,
      "",
      `DROP QUANTITY: ${product.quantity}`,
      `STATUS: ${product.soldOut ? "SOLD OUT" : "AVAILABLE"}`,
      `SERIAL EXAMPLE: ${product.serialFormat}`,
      "",
      "FILE END."
    ].join("\n");
  }, [activeFile]);

  return (
    <div className="apple2-overlay" role="dialog" aria-modal="true">
      <div className="apple2-header">
        <span>PERSONALITIES // FILE EXPLORER</span>
        <button type="button" onClick={onClose}>CLOSE</button>
      </div>
      <div className="apple2-body">
        <div className="apple2-files">
          {files.map((file) => (
            <button
              key={file.id}
              type="button"
              className={file.id === activeFile.id ? "active" : ""}
              onClick={() => setActiveFile(file)}
            >
              {file.title}
            </button>
          ))}
        </div>
        <pre className="apple2-text">{fileBody}</pre>
      </div>
    </div>
  );
}
