import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Link } from "react-router-dom";
import { drops } from "../data/drops.js";
import ProductPedestal from "../components/ProductPedestal.jsx";
import stampMark from "../assets/logo.png";

function HeroStamp({ onEnter }) {
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const stampTexture = useTexture(stampMark);

  const makeStampMaterial = () => {
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: true,
      toneMapped: false,
      side: THREE.FrontSide,
    });
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <map_fragment>",
        `
        #include <map_fragment>
        if (diffuseColor.rgb.r < 0.08 && diffuseColor.rgb.g < 0.08 && diffuseColor.rgb.b < 0.08) {
          discard;
        }
        `
      );
    };
    return material;
  };

  const stampMaterial = useMemo(() => makeStampMaterial(), []);
  const stampMaterialBack = useMemo(() => makeStampMaterial(), []);

  useEffect(() => {
    if (!stampTexture) return;
    stampTexture.colorSpace = THREE.SRGBColorSpace;
    stampTexture.anisotropy = 4;
    stampTexture.needsUpdate = true;
    stampMaterial.map = stampTexture;
    stampMaterial.needsUpdate = true;
    stampMaterialBack.map = stampTexture;
    stampMaterialBack.needsUpdate = true;
  }, [stampTexture, stampMaterial, stampMaterialBack]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.25;
    const targetZ = hovered ? 0.18 : 0;
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      0.08
    );
  });

  return (
    <group>
      <group
        ref={groupRef}
        position={[0, 0.1, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onEnter}
      >
        <mesh>
          <planeGeometry args={[3.4, 1.7]} />
          <primitive object={stampMaterial} attach="material" />
        </mesh>
        <mesh rotation={[0, Math.PI, 0]} position={[0, 0, -0.01]}>
          <planeGeometry args={[3.4, 1.7]} />
          <primitive object={stampMaterialBack} attach="material" />
        </mesh>
      </group>

      <Html center position={[0, -1.8, 0]}>
        <div className="hero-copy">
          <button className="enter-btn" type="button" onClick={onEnter}>
            Enter
          </button>
        </div>
      </Html>
    </group>
  );
}

const SHOP_BASE_URL = "https://shop.wtfwerks.com";

function ProductCard({ product, onView }) {
  return (
    <article className="product-card">
      <div className="product-card__media">
        <div className="product-card__tag">{product.personalityName}</div>
        <div className="product-card__title">{product.name}</div>
      </div>
      <div className="product-card__body">
        <p>{product.personalityTagline}</p>
        <div className="product-card__meta">
          <span>{product.serialFormat}</span>
          <span>{product.soldOut ? "SEALED" : "LIVE"}</span>
        </div>
        <div className="product-card__actions">
          <button className="product-card__cta" type="button" onClick={() => onView(product)}>
            View Object
          </button>
          <a
            className="product-card__cta ghost"
            href={`${SHOP_BASE_URL}/products/${product.shopifyHandle}`}
            target="_blank"
            rel="noreferrer"
          >
            Purchase
          </a>
        </div>
      </div>
    </article>
  );
}

function ProductViewer({ product, onClose, ageAccepted, onAcceptAge }) {
  const isRestricted = Boolean(product.requiresAgeGate);
  const showGate = isRestricted && !ageAccepted;
  return (
    <div className="product-modal" onClick={onClose}>
      <div className="product-modal__inner" onClick={(event) => event.stopPropagation()}>
        <button className="product-modal__close" type="button" onClick={onClose}>
          Close
        </button>
        {showGate && (
          <div className="age-banner">
            <div className="age-banner__text">
              <strong>21+ CONTENT</strong> Waterpipe is restricted. Confirm you are 21+ to view.
            </div>
            <div className="age-banner__actions">
              <button type="button" onClick={onAcceptAge}>I’m 21+</button>
            </div>
          </div>
        )}
        {!showGate && (
          <div className="product-modal__content">
            <div className="product-modal__canvas">
              <Canvas camera={{ position: [0, 1.2, 3.8], fov: 45 }}>
                <color attach="background" args={["#0b0d12"]} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[4, 6, 2]} intensity={1.2} color="#f6e2b5" />
                <pointLight position={[-4, 1.5, 1]} intensity={0.7} color="#6dd6ff" />
                <pointLight position={[3, 1.2, -1.5]} intensity={0.7} color="#f2a873" />
                <group position={[0, -0.4, 0]}>
                  <ProductPedestal product={product} position={[0, 0, 0]} onSelect={() => {}} />
                </group>
              </Canvas>
            </div>
            <div className="product-modal__info">
              <div className="product-modal__title">{product.name}</div>
              <div className="product-modal__subtitle">{product.personalityName}</div>
              <p>{product.personalityTagline}</p>
              <div className="product-modal__meta">
                <span>{product.serialFormat}</span>
                <span>{product.soldOut ? "SEALED" : "LIVE"}</span>
              </div>
              <a
                className="product-card__cta"
                href={`${SHOP_BASE_URL}/products/${product.shopifyHandle}`}
                target="_blank"
                rel="noreferrer"
              >
                Purchase
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [ageAccepted, setAgeAccepted] = useState(
    () => sessionStorage.getItem("wtfwerks_age_ok") === "true"
  );
  const productsRef = useRef(null);
  const liveDrop = drops.find((drop) => drop.status === "LIVE");
  const products = liveDrop?.products || [];

  const handleEnter = () => {
    if (!productsRef.current) return;
    productsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => {
      if (!menuOpen) return;
      setMenuOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  return (
    <div className={`app ${activeProduct ? "modal-open" : ""}`}>
      <header className="topbar">
        <div className="logo">
          <img src={stampMark} alt="WTFWERKS stamp" />
          <span>WTFWERKS</span>
        </div>
        <button
          className={`burger ${menuOpen ? "open" : ""}`}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        {menuOpen && (
          <nav className="menu">
            <a href="#products" onClick={() => setMenuOpen(false)}>
              Products
            </a>
            <Link to="/personalities" onClick={() => setMenuOpen(false)}>
              Personalities
            </Link>
            <Link to="/app" onClick={() => setMenuOpen(false)}>
              App
            </Link>
          </nav>
        )}
      </header>

      <section className="hero">
        <Canvas camera={{ position: [0, 0.9, 5], fov: 45 }}>
          <color attach="background" args={["#07090e"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 6, 3]} intensity={1.1} color="#f6e2b5" />
          <pointLight position={[-5, 1.5, 2]} intensity={0.7} color="#6dd6ff" />
          <pointLight position={[4, 1.2, -2]} intensity={0.8} color="#f2a873" />
          <HeroStamp onEnter={handleEnter} />
        </Canvas>
        <div className="hero-overlay">
          <div className="hero-title">LUXURY OBJECTS WITH PERSONALITIES</div>
          <div className="hero-subtitle">Fun is the Utility.</div>
        </div>
      </section>

      <main>
        <section id="products" className="section products" ref={productsRef}>
          <div className="section__header">
            <h2>CERTIFIED OBJECTS</h2>
            <p>Every drop ships with a personality baked in.</p>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={(item) => setActiveProduct(item)}
              />
            ))}
          </div>
        </section>
      </main>

      {activeProduct && (
        <ProductViewer
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          ageAccepted={ageAccepted}
          onAcceptAge={() => {
            sessionStorage.setItem("wtfwerks_age_ok", "true");
            setAgeAccepted(true);
          }}
        />
      )}
    </div>
  );
}
