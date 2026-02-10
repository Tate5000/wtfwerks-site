import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const PERSONALITY = {
  wallet: {
    blinkMin: 0.6,
    blinkMax: 1.4,
    blinkSpeed: 7,
    saccadeSpeed: 6,
    pupil: 4.2,
    openness: 0.6,
    drift: 0.8,
    jitter: 0.8,
    hoverBoost: 0.4,
  },
  waterpipe: {
    blinkMin: 2.4,
    blinkMax: 3.8,
    blinkSpeed: 3.5,
    saccadeSpeed: 1.5,
    pupil: 6,
    openness: 0.45,
    drift: 0.4,
    jitter: 0.1,
    hoverBoost: 0.2,
  },
  purse: {
    blinkMin: 2.0,
    blinkMax: 3.2,
    blinkSpeed: 4.5,
    saccadeSpeed: 2,
    pupil: 5,
    openness: 0.75,
    drift: 0.2,
    jitter: 0.05,
    hoverBoost: 0.15,
  },
  backpack: {
    blinkMin: 1.6,
    blinkMax: 2.4,
    blinkSpeed: 5.5,
    saccadeSpeed: 5,
    pupil: 5.5,
    openness: 0.85,
    drift: 0.6,
    jitter: 0.2,
    hoverBoost: 0.2,
  },
  frame: {
    blinkMin: 3.2,
    blinkMax: 4.5,
    blinkSpeed: 2.8,
    saccadeSpeed: 0.8,
    pupil: 4,
    openness: 0.5,
    drift: 0.1,
    jitter: 0.02,
    hoverBoost: -0.2,
  },
  clock: {
    blinkMin: 1.8,
    blinkMax: 3.0,
    blinkSpeed: 3.2,
    saccadeSpeed: 1.2,
    pupil: 4.8,
    openness: 0.65,
    drift: 0.25,
    jitter: 0.18,
    hoverBoost: 0.1,
  },
  cooler: {
    blinkMin: 2.2,
    blinkMax: 3.6,
    blinkSpeed: 3.6,
    saccadeSpeed: 1.4,
    pupil: 5.2,
    openness: 0.7,
    drift: 0.2,
    jitter: 0.12,
    hoverBoost: 0.05,
  },
};

function nextBlink(config) {
  return config.blinkMin + Math.random() * (config.blinkMax - config.blinkMin);
}

export default function EyesOLED({ personality, gazeTarget, hovered, winkSignal }) {
  const canvasRef = useRef(null);
  const blinkTimer = useRef(nextBlink(PERSONALITY[personality]));
  const blinkProgress = useRef(0);
  const pupil = useRef({ x: 0, y: 0 });
  const gaze = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const winkRef = useRef(0);
  const surpriseRef = useRef(0);
  const winkSignalRef = useRef(winkSignal);

  const config = PERSONALITY[personality] || PERSONALITY.wallet;

  const canvas = useMemo(() => {
    const node = document.createElement("canvas");
    node.width = 128;
    node.height = 64;
    return node;
  }, []);

  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [canvas]);

  useEffect(() => {
    canvasRef.current = canvas;
  }, [canvas, texture]);

  useEffect(() => {
    if (winkSignal !== winkSignalRef.current) {
      winkRef.current = 0.6;
      winkSignalRef.current = winkSignal;
    }
  }, [winkSignal]);

  useFrame((_, delta) => {
    timeRef.current += delta;

    blinkTimer.current -= delta;
    if (blinkTimer.current <= 0) {
      blinkProgress.current = 0.001;
      blinkTimer.current = nextBlink(config);
    }

    if (blinkProgress.current > 0) {
      blinkProgress.current += delta * config.blinkSpeed;
      if (blinkProgress.current >= 1) {
        blinkProgress.current = 0;
      }
    }

    let targetX = (gazeTarget?.x ?? 0) * 8;
    const targetY = (gazeTarget?.y ?? 0) * 4;

    if (personality === "purse" && hovered) {
      targetX = -6.5;
    }

    pupil.current.x += (targetX - pupil.current.x) * 0.08;
    pupil.current.y += (targetY - pupil.current.y) * 0.08;

    const drift = Math.sin(timeRef.current * config.saccadeSpeed) * config.drift;
    const jitter = (Math.random() - 0.5) * config.jitter;

    gaze.current.x = pupil.current.x + drift + jitter;
    gaze.current.y = pupil.current.y + drift * 0.5 + jitter * 0.2;

    if (winkRef.current > 0) {
      winkRef.current -= delta;
    }

    if (personality === "waterpipe" && Math.random() < delta * 0.15) {
      surpriseRef.current = 0.6;
    }
    if (surpriseRef.current > 0) {
      surpriseRef.current -= delta;
    }

    if (personality === "backpack" && hovered && Math.random() < delta * 0.6) {
      winkRef.current = 0.5;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(65, 242, 166, 0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 10, canvas.width - 12, canvas.height - 20);

    const blinkAmount = blinkProgress.current > 0
      ? Math.sin(blinkProgress.current * Math.PI)
      : 0;

    let openness = config.openness + (hovered ? config.hoverBoost : 0);
    if (personality === "frame" && hovered) {
      openness = Math.max(0.2, openness - 0.25);
    }
    if (personality === "wallet" && hovered) {
      openness = Math.min(1.2, openness + 0.3);
    }
    if (personality === "waterpipe" && surpriseRef.current > 0) {
      openness = Math.min(1.1, openness + 0.35);
    }

    const eyeWidth = 26;
    const eyeHeight = 18 * openness;
    const centerY = 32;
    const leftX = 42;
    const rightX = 86;

    const drawEye = (x, wink) => {
      const blinkScale = wink ? 1 : (1 - blinkAmount * 0.85);
      const h = Math.max(2, eyeHeight * blinkScale);

    ctx.fillStyle = "rgba(210, 255, 233, 0.95)";
    ctx.strokeStyle = "rgba(65, 242, 166, 0.35)";
    ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(x, centerY, eyeWidth / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (h <= 4) return;

      const pupilSize = config.pupil + (hovered ? 1.2 : 0);
      ctx.fillStyle = "#0c0c0c";
      ctx.beginPath();
      ctx.ellipse(
        x + gaze.current.x,
        centerY + gaze.current.y,
        pupilSize,
        pupilSize,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.fillStyle = "rgba(15,15,15,0.4)";
      ctx.beginPath();
      ctx.arc(x + gaze.current.x - 2, centerY + gaze.current.y - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const winkLeft = personality === "backpack" && winkRef.current > 0;
    drawEye(leftX, winkLeft);
    drawEye(rightX, false);

    texture.needsUpdate = true;
  });

  return (
    <mesh>
      <planeGeometry args={[0.22, 0.11]} />
      <meshBasicMaterial
        map={texture}
        transparent
        toneMapped={false}
        opacity={0.95}
      />
    </mesh>
  );
}
