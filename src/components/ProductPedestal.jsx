import React, { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import EyesOLED from "./EyesOLED.jsx";
import { accentColors } from "../data/drops.js";

export default function ProductPedestal({ product, position, onSelect }) {
  const groupRef = useRef(null);
  const productRef = useRef(null);
  const ringRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [winkSignal, setWinkSignal] = useState(0);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  const accent = accentColors[product.visualToken] || "#c9a24d";
  const targetTilt = useMemo(() => new THREE.Euler(0, 0, 0), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const targetX = hovered ? -0.06 : 0;
    const targetZ = hovered ? 0.06 : 0;
    targetTilt.set(targetX, 0, targetZ);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetTilt.x,
      0.1
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetTilt.z,
      0.1
    );

    const t = state.clock.getElapsedTime();
    if (productRef.current) {
      const hoverBoost = hovered ? 0.06 : 0;
      productRef.current.position.y = 0.6 + Math.sin(t * 1.2 + phase) * 0.04 + hoverBoost;
      productRef.current.rotation.y += delta * 0.4;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.6;
      const emissive = 0.35 + Math.sin(t * 2 + phase) * 0.15;
      const material = ringRef.current.material;
      if (Array.isArray(material)) {
        material.forEach((mat) => {
          mat.emissiveIntensity = emissive;
        });
      } else if (material) {
        material.emissiveIntensity = emissive;
      }
    }
  });

  const handlePointerMove = (event) => {
    if (!groupRef.current) return;
    const localPoint = groupRef.current.worldToLocal(event.point.clone());
    const x = THREE.MathUtils.clamp(localPoint.x * 1.5, -1, 1);
    const y = THREE.MathUtils.clamp(localPoint.y * 1.5, -1, 1);
    setGaze({ x, y });
  };

  const handleClick = () => {
    if (product.personalityKey === "backpack") {
      setWinkSignal((value) => value + 1);
    }
    onSelect(product);
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => {
        setHovered(false);
        setGaze({ x: 0, y: 0 });
      }}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      <mesh>
        <cylinderGeometry args={[0.62, 0.7, 0.22, 32]} />
        <meshStandardMaterial color="#2f2a2a" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.54, 0.6, 0.1, 32]} />
        <meshStandardMaterial color="#4a3f3a" metalness={0.75} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.03, 32]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.35} />
      </mesh>

      <mesh ref={ringRef} position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.52, 0.02, 16, 64]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} />
      </mesh>

      <group ref={productRef}>
        <ProductGeometry productId={product.id} accent={accent} hovered={hovered} />
        <group position={getEyesAnchor(product.id)}>
          <EyesOLED
            personality={product.personalityKey}
            gazeTarget={gaze}
            hovered={hovered}
            winkSignal={winkSignal}
          />
        </group>
      </group>
    </group>
  );
}

function ProductGeometry({ productId, accent, hovered }) {
  const glow = hovered ? 0.55 : 0.2;
  const lidRef = useRef(null);
  const accentRef = useRef(null);

  useFrame((state) => {
    if (!productId.includes("cooler")) return;
    const t = state.clock.getElapsedTime();
    if (lidRef.current) {
      lidRef.current.rotation.x = Math.sin(t * 1.2) * 0.08;
      lidRef.current.position.y = 0.34 + Math.sin(t * 1.2) * 0.01;
    }
    if (accentRef.current && accentRef.current.material) {
      accentRef.current.material.emissiveIntensity =
        glow + Math.sin(t * 2.0) * 0.15;
    }
  });
  if (productId.includes("wallet")) {
    return (
      <group>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.74, 0.14, 0.5]} />
          <meshStandardMaterial color="#3a2b1c" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.13, -0.02]}>
          <boxGeometry args={[0.72, 0.04, 0.46]} />
          <meshStandardMaterial color="#5b3f25" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.16, 0.2]}>
          <boxGeometry args={[0.5, 0.02, 0.12]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={glow} />
        </mesh>
        <mesh position={[0.26, 0.11, 0]}>
          <boxGeometry args={[0.06, 0.1, 0.34]} />
          <meshStandardMaterial color="#6b4b2a" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[-0.26, 0.11, 0]}>
          <boxGeometry args={[0.06, 0.1, 0.34]} />
          <meshStandardMaterial color="#6b4b2a" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>
    );
  }

  if (productId.includes("waterpipe")) {
    return (
      <group>
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshPhysicalMaterial color="#3a4f6b" metalness={0.6} roughness={0.25} clearcoat={0.6} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.12, 0.18, 0.6, 24]} />
          <meshPhysicalMaterial color="#4b6aa1" metalness={0.6} roughness={0.22} clearcoat={0.5} />
        </mesh>
        <mesh position={[0.18, 0.4, 0.12]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.05, 0.06, 0.36, 18]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={glow} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.2, 18]} />
          <meshStandardMaterial color="#2f3f5c" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <torusGeometry args={[0.16, 0.02, 12, 36]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={glow} />
        </mesh>
      </group>
    );
  }

  if (productId.includes("purse")) {
    return (
      <group>
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.64, 0.32, 0.38]} />
          <meshStandardMaterial color="#9a4e85" metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.3, 0.12]}>
          <boxGeometry args={[0.52, 0.08, 0.04]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={glow} />
        </mesh>
        <mesh position={[0, 0.34, -0.06]}>
          <torusGeometry args={[0.24, 0.025, 12, 36]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={glow} />
        </mesh>
        <mesh position={[0, 0.18, -0.2]}>
          <boxGeometry args={[0.5, 0.06, 0.08]} />
          <meshStandardMaterial color="#7f4b6d" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    );
  }

  if (productId.includes("backpack")) {
    return (
      <group>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.52, 0.46, 0.34]} />
          <meshStandardMaterial color="#4b2d7a" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.36, -0.08]}>
          <boxGeometry args={[0.36, 0.18, 0.12]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={glow} />
        </mesh>
        <mesh position={[-0.26, 0.22, -0.18]}>
          <boxGeometry args={[0.08, 0.36, 0.06]} />
          <meshStandardMaterial color="#6b3aa1" metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh position={[0.26, 0.22, -0.18]}>
          <boxGeometry args={[0.08, 0.36, 0.06]} />
          <meshStandardMaterial color="#6b3aa1" metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.12, 0.18]}>
          <boxGeometry args={[0.42, 0.12, 0.08]} />
          <meshStandardMaterial color="#5a2f8a" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>
    );
  }

  if (productId.includes("clock")) {
    return (
      <group>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.08, 32]} />
          <meshStandardMaterial color="#d9a25e" metalness={0.85} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.22, 0.05]}>
          <cylinderGeometry args={[0.32, 0.32, 0.02, 32]} />
          <meshStandardMaterial color="#fff3d2" metalness={0.2} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.22, 0.07]}>
          <boxGeometry args={[0.18, 0.02, 0.01]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={glow} />
        </mesh>
        <mesh position={[0.08, 0.22, 0.07]} rotation={[0, 0, 0.6]}>
          <boxGeometry args={[0.12, 0.015, 0.01]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={glow} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.08, 18]} />
          <meshStandardMaterial color="#b77d3f" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>
    );
  }

  if (productId.includes("cooler")) {
    return (
      <group>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.62, 0.32, 0.42]} />
          <meshStandardMaterial color="#cfe7f4" metalness={0.25} roughness={0.45} />
        </mesh>
        <mesh ref={lidRef} position={[0, 0.34, 0]}>
          <boxGeometry args={[0.7, 0.08, 0.48]} />
          <meshStandardMaterial color="#8fbfdc" metalness={0.4} roughness={0.35} />
        </mesh>
        <mesh ref={accentRef} position={[0, 0.2, 0.24]}>
          <boxGeometry args={[0.5, 0.08, 0.06]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={glow} />
        </mesh>
        <mesh position={[-0.24, 0.18, -0.24]}>
          <boxGeometry args={[0.06, 0.18, 0.06]} />
          <meshStandardMaterial color="#7aa8c4" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0.24, 0.18, -0.24]}>
          <boxGeometry args={[0.06, 0.18, 0.06]} />
          <meshStandardMaterial color="#7aa8c4" metalness={0.4} roughness={0.5} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.72, 0.5, 0.12]} />
        <meshStandardMaterial color="#c9a24d" metalness={0.95} roughness={0.16} emissive="#c9a24d" emissiveIntensity={glow} />
      </mesh>
      <mesh position={[0, 0.18, 0.08]}>
        <planeGeometry args={[0.48, 0.36]} />
        <meshStandardMaterial color="#3b2f1a" metalness={0.45} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.18, -0.02]}>
        <planeGeometry args={[0.36, 0.24]} />
        <meshStandardMaterial color="#6b4e2b" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.18, 0.1]}>
        <boxGeometry args={[0.54, 0.42, 0.02]} />
        <meshStandardMaterial color="#e0c27a" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function getEyesAnchor(productId) {
  if (productId.includes("wallet")) return [0.02, 0.16, 0.28];
  if (productId.includes("waterpipe")) return [0, 0.4, 0.24];
  if (productId.includes("purse")) return [0.1, 0.22, 0.26];
  if (productId.includes("backpack")) return [0, 0.24, 0.24];
  if (productId.includes("clock")) return [0, 0.28, 0.18];
  if (productId.includes("cooler")) return [0, 0.22, 0.26];
  return [0, 0.22, 0.2];
}
