import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Link } from "react-router-dom";
import { drops } from "../data/drops.js";
import Apple2Terminal from "../components/Apple2Terminal.jsx";
import LogoMark from "../components/LogoMark.jsx";

function CRTConsole({ onActivate }) {
  const groupRef = useRef(null);
  const screenRef = useRef(null);
  const hintTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#020b07";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(65, 242, 166, 0.04)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(65, 242, 166, 0.9)";
    ctx.font = "22px VT323, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Tap the screen to access", canvas.width / 2, canvas.height / 2 - 14);
    ctx.fillText("personalities.", canvas.width / 2, canvas.height / 2 + 14);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const keycaps = useMemo(() => {
    const keys = [];
    const rows = 3;
    const cols = 8;
    const startX = -0.85;
    const startZ = 1.22;
    const stepX = 0.22;
    const stepZ = 0.1;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        keys.push([startX + c * stepX, -0.84, startZ + r * stepZ]);
      }
    }
    return keys;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.3 + phase) * 0.2;
    groupRef.current.position.y = 0.2 + Math.sin(t * 0.7 + phase) * 0.06;
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[2.6, 1.4, 1.2]} />
        <meshStandardMaterial color="#b9b39c" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.35, 0.1]}>
        <boxGeometry args={[2.2, 0.5, 0.8]} />
        <meshStandardMaterial color="#a79f85" metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.2, 0.65]}>
        <boxGeometry args={[1.6, 0.9, 0.08]} />
        <meshStandardMaterial color="#0c0c0c" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh
        ref={screenRef}
        position={[0, 0.2, 0.69]}
        onClick={onActivate}
        onPointerDown={onActivate}
      >
        <planeGeometry args={[1.4, 0.75]} />
        <meshBasicMaterial
          map={hintTexture}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, -0.6, 0.55]}>
        <boxGeometry args={[1.9, 0.1, 0.35]} />
        <meshStandardMaterial color="#2b2b2b" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, -1.02, 0.9]}>
        <boxGeometry args={[2.6, 0.16, 1.1]} />
        <meshStandardMaterial color="#cfc7b8" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.92, 1.48]}>
        <boxGeometry args={[2.1, 0.06, 0.56]} />
        <meshStandardMaterial color="#e6dfd2" metalness={0.15} roughness={0.6} />
      </mesh>
      {keycaps.map((pos, index) => (
        <mesh key={`key-${index}`} position={pos}>
          <boxGeometry args={[0.16, 0.03, 0.06]} />
          <meshStandardMaterial color="#f3eee4" metalness={0.1} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0.98, -0.86, 1.02]}>
        <boxGeometry args={[0.32, 0.04, 0.2]} />
        <meshStandardMaterial color="#6b6b6b" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0.98, -0.85, 1.09]}>
        <boxGeometry args={[0.18, 0.02, 0.1]} />
        <meshStandardMaterial color="#f2efe6" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[1.6, -0.88, 1.24]}>
        <boxGeometry args={[0.34, 0.04, 0.24]} />
        <meshStandardMaterial color="#d7d2c6" metalness={0.25} roughness={0.5} />
      </mesh>
      <mesh position={[1.6, -0.87, 1.31]}>
        <boxGeometry args={[0.16, 0.02, 0.08]} />
        <meshStandardMaterial color="#f8f4ea" metalness={0.35} roughness={0.4} />
      </mesh>
    </group>
  );
}

export default function Personalities() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const liveDrop = drops.find((drop) => drop.status === "LIVE");
  const products = liveDrop?.products || [];

  return (
    <div className="app personalities-page">
      <header className="topbar">
        <div className="logo">
          <LogoMark />
          <span>WTFWERKS</span>
        </div>
        <Link className="back-link" to="/">
          Back
        </Link>
      </header>

      <section className="personalities-stage">
        <Canvas camera={{ position: [0, 1.2, 5.6], fov: 45 }}>
          <color attach="background" args={["#07090e"]} />
          <ambientLight intensity={0.45} />
          <directionalLight position={[4, 6, 3]} intensity={1.1} color="#f6e2b5" />
          <pointLight position={[-5, 2, 1.5]} intensity={0.9} color="#41f2a6" />
          <pointLight position={[5, 1.4, -1.5]} intensity={0.6} color="#f2a873" />
          <CRTConsole onActivate={() => setTerminalOpen(true)} />
        </Canvas>
      </section>

      {terminalOpen && <Apple2Terminal onClose={() => setTerminalOpen(false)} />}
    </div>
  );
}
