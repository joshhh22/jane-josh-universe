"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Float,
  Text3D,
  MeshWobbleMaterial,
  RoundedBox,
  Sphere,
  Torus,
  Cylinder,
  Cone,
  Box,
} from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface OurRoom3DProps {
  interactive?: boolean;
}

// ─── ROOM GEOMETRY ───────────────────────────────────────────
function RoomGeometry() {
  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshLambertMaterial color="#F5EDD6" />
      </mesh>

      {/* Back wall */}
      <mesh receiveShadow position={[0, 1.5, -5]}>
        <planeGeometry args={[10, 7]} />
        <meshLambertMaterial color="#FFFDF8" />
      </mesh>

      {/* Left wall */}
      <mesh receiveShadow rotation={[0, Math.PI / 2, 0]} position={[-5, 1.5, 0]}>
        <planeGeometry args={[10, 7]} />
        <meshLambertMaterial color="#FFF0F5" />
      </mesh>

      {/* Skirting board line on back wall */}
      <mesh position={[0, -1.2, -4.9]}>
        <boxGeometry args={[10, 0.1, 0.05]} />
        <meshLambertMaterial color="#EFA3B5" />
      </mesh>
    </group>
  );
}

// ─── FLOATING STARS ──────────────────────────────────────────
function FloatingStars() {
  const positions = Array.from({ length: 12 }, (_, i) => ({
    x: (Math.random() - 0.5) * 8,
    y: 0.5 + Math.random() * 2.5,
    z: -4 + Math.random() * 2,
    speed: 0.3 + Math.random() * 0.5,
    delay: i * 0.3,
  }));

  return (
    <>
      {positions.map((pos, i) => (
        <Float key={i} speed={pos.speed} floatIntensity={0.5} rotationIntensity={0.2}>
          <mesh position={[pos.x, pos.y, pos.z]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshBasicMaterial color={i % 3 === 0 ? "#FFE39A" : i % 3 === 1 ? "#FFB7C5" : "#C9C2FF"} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// ─── INTERACTIVE OBJECT ──────────────────────────────────────
interface InteractableProps {
  children: React.ReactNode;
  href: string;
  interactive: boolean;
  label: string;
}

function Interactable({ children, href, interactive, label }: InteractableProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetScale = hovered ? 1.12 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={interactive ? () => router.push(href) : undefined}
      onPointerEnter={interactive ? () => { setHovered(true); document.body.style.cursor = "pointer"; } : undefined}
      onPointerLeave={interactive ? () => { setHovered(false); document.body.style.cursor = "auto"; } : undefined}
    >
      {children}
    </group>
  );
}

// ─── TEDDY BEAR (Jane Lore) ───────────────────────────────────
function TeddyBear({ interactive }: { interactive: boolean }) {
  return (
    <Interactable href="/jane" interactive={interactive} label="Jane Lore™">
      <Float speed={1} floatIntensity={0.3}>
        <group position={[-3.2, -0.8, -2]}>
          {/* Body */}
          <mesh>
            <sphereGeometry args={[0.32, 8, 8]} />
            <meshLambertMaterial color="#C8966C" />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.22, 8, 8]} />
            <meshLambertMaterial color="#C8966C" />
          </mesh>
          {/* Ears */}
          <mesh position={[-0.15, 0.56, 0]}>
            <sphereGeometry args={[0.09, 6, 6]} />
            <meshLambertMaterial color="#B07840" />
          </mesh>
          <mesh position={[0.15, 0.56, 0]}>
            <sphereGeometry args={[0.09, 6, 6]} />
            <meshLambertMaterial color="#B07840" />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.07, 0.44, 0.2]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshBasicMaterial color="#171717" />
          </mesh>
          <mesh position={[0.07, 0.44, 0.2]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshBasicMaterial color="#171717" />
          </mesh>
          {/* Nose */}
          <mesh position={[0, 0.38, 0.22]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshBasicMaterial color="#171717" />
          </mesh>
          {/* Tummy patch */}
          <mesh position={[0, -0.04, 0.29]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshLambertMaterial color="#D8A882" />
          </mesh>
          {/* Arms */}
          <mesh position={[-0.3, 0, 0]} rotation={[0, 0, 0.5]}>
            <capsuleGeometry args={[0.07, 0.2, 4, 8]} />
            <meshLambertMaterial color="#C8966C" />
          </mesh>
          <mesh position={[0.3, 0, 0]} rotation={[0, 0, -0.5]}>
            <capsuleGeometry args={[0.07, 0.2, 4, 8]} />
            <meshLambertMaterial color="#C8966C" />
          </mesh>
          {/* Bow */}
          <mesh position={[0, 0.2, 0.3]}>
            <torusGeometry args={[0.06, 0.025, 4, 8]} />
            <meshLambertMaterial color="#FFB7C5" />
          </mesh>
        </group>
      </Float>
    </Interactable>
  );
}

// ─── ENVELOPE (Letters) ──────────────────────────────────────
function Envelope({ interactive }: { interactive: boolean }) {
  const envRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (envRef.current) {
      envRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
    }
  });

  return (
    <Interactable href="/letters" interactive={interactive} label="Letters">
      <group ref={envRef} position={[-1.5, -0.9, -2.5]}>
        {/* Envelope body */}
        <mesh>
          <boxGeometry args={[0.6, 0.4, 0.04]} />
          <meshLambertMaterial color="#FFE39A" />
        </mesh>
        {/* Envelope flap */}
        <mesh position={[0, 0.15, 0.01]} rotation={[0.4, 0, 0]}>
          <coneGeometry args={[0.3, 0.25, 3, 1]} />
          <meshLambertMaterial color="#F5D27A" />
        </mesh>
        {/* Heart seal */}
        <mesh position={[0, 0, 0.03]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshLambertMaterial color="#EFA3B5" />
        </mesh>
      </group>
    </Interactable>
  );
}

// ─── HEADPHONES (Music) ──────────────────────────────────────
function Headphones({ interactive }: { interactive: boolean }) {
  return (
    <Interactable href="/music" interactive={interactive} label="Music">
      <Float speed={0.8} floatIntensity={0.4}>
        <group position={[0.5, -0.4, -2.8]}>
          {/* Band */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.25, 0.04, 6, 20, Math.PI]} />
            <meshLambertMaterial color="#171717" />
          </mesh>
          {/* Left cup */}
          <mesh position={[-0.25, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 10]} />
            <meshLambertMaterial color="#C9C2FF" />
          </mesh>
          {/* Right cup */}
          <mesh position={[0.25, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 10]} />
            <meshLambertMaterial color="#C9C2FF" />
          </mesh>
          {/* Cord */}
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.4, 6]} />
            <meshLambertMaterial color="#171717" />
          </mesh>
        </group>
      </Float>
    </Interactable>
  );
}

// ─── CAMERA (Memories) ───────────────────────────────────────
function Camera3D({ interactive }: { interactive: boolean }) {
  return (
    <Interactable href="/memories" interactive={interactive} label="Memories">
      <group position={[2.2, -0.9, -2]}>
        {/* Camera body */}
        <RoundedBox args={[0.55, 0.38, 0.22]} radius={0.04} smoothness={4}>
          <meshLambertMaterial color="#171717" />
        </RoundedBox>
        {/* Lens */}
        <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
          <meshLambertMaterial color="#333" />
        </mesh>
        <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
          <meshLambertMaterial color="#B9D9FF" />
        </mesh>
        {/* Viewfinder */}
        <mesh position={[0.16, 0.12, 0.1]}>
          <boxGeometry args={[0.1, 0.07, 0.04]} />
          <meshLambertMaterial color="#222" />
        </mesh>
        {/* Shutter */}
        <mesh position={[0.22, 0.17, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshLambertMaterial color="#EFA3B5" />
        </mesh>
      </group>
    </Interactable>
  );
}

// ─── PLANT (Surprise Box) ────────────────────────────────────
function Plant({ interactive }: { interactive: boolean }) {
  return (
    <Interactable href="/surprises" interactive={interactive} label="Surprises">
      <group position={[3.5, -1.0, -1.5]}>
        {/* Pot */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.18, 0.14, 0.25, 8]} />
          <meshLambertMaterial color="#EFA3B5" />
        </mesh>
        {/* Soil */}
        <mesh position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.04, 8]} />
          <meshLambertMaterial color="#8B6F47" />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.35, 6]} />
          <meshLambertMaterial color="#5D8A3C" />
        </mesh>
        {/* Leaves */}
        {[[-0.15, 0.25, 0.1], [0.15, 0.32, -0.05], [-0.1, 0.38, -0.08]].map(([x, y, z], i) => (
          <Float key={i} speed={0.5 + i * 0.2} floatIntensity={0.2} rotationIntensity={0.1}>
            <mesh position={[x, y, z]} rotation={[0.2, i * 0.8, 0.3]}>
              <sphereGeometry args={[0.1, 6, 6]} />
              <meshLambertMaterial color="#C8E6C9" />
            </mesh>
          </Float>
        ))}
      </group>
    </Interactable>
  );
}

// ─── VINYL RECORD (Soundtrack) ───────────────────────────────
function VinylRecord({ interactive }: { interactive: boolean }) {
  const vinylRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (vinylRef.current) vinylRef.current.rotation.z += delta * 0.5;
  });

  return (
    <Interactable href="/music" interactive={interactive} label="Soundtrack">
      <group ref={vinylRef} position={[1.8, -0.3, -4.5]} rotation={[0.3, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.02, 24]} />
          <meshLambertMaterial color="#171717" />
        </mesh>
        <mesh position={[0, 0.015, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.01, 16]} />
          <meshLambertMaterial color="#EFA3B5" />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.03, 8]} />
          <meshBasicMaterial color="#FFFDF8" />
        </mesh>
      </group>
    </Interactable>
  );
}

// ─── COMPUTER (Secret Room) ──────────────────────────────────
function TinyComputer({ interactive }: { interactive: boolean }) {
  const screenRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshLambertMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Interactable href="/secret" interactive={interactive} label="???">
      <group position={[-2.8, -0.7, -4.2]}>
        {/* Monitor body */}
        <RoundedBox args={[0.5, 0.38, 0.06]} radius={0.03} smoothness={4} position={[0, 0.1, 0]}>
          <meshLambertMaterial color="#171717" />
        </RoundedBox>
        {/* Screen */}
        <mesh ref={screenRef} position={[0, 0.1, 0.04]}>
          <planeGeometry args={[0.38, 0.26]} />
          <meshLambertMaterial color="#0a0a2e" emissive="#1a1a6e" emissiveIntensity={0.5} />
        </mesh>
        {/* Stand */}
        <mesh position={[0, -0.12, 0.04]}>
          <boxGeometry args={[0.08, 0.12, 0.04]} />
          <meshLambertMaterial color="#222" />
        </mesh>
        {/* Base */}
        <mesh position={[0, -0.2, 0.04]}>
          <boxGeometry args={[0.22, 0.03, 0.14]} />
          <meshLambertMaterial color="#222" />
        </mesh>
        {/* Keyboard */}
        <RoundedBox args={[0.4, 0.04, 0.18]} radius={0.02} smoothness={4} position={[0, -0.22, 0.14]}>
          <meshLambertMaterial color="#333" />
        </RoundedBox>
      </group>
    </Interactable>
  );
}

// ─── LAMP (Toggle light) ─────────────────────────────────────
function Lamp() {
  const [on, setOn] = useState(true);
  return (
    <group position={[-4.5, -0.5, -3]} onClick={() => setOn(!on)}>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
        <meshLambertMaterial color="#B07840" />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <coneGeometry args={[0.25, 0.3, 8, 1, true]} />
        <meshLambertMaterial color="#FFE39A" side={THREE.DoubleSide} />
      </mesh>
      {on && (
        <pointLight position={[0, 0.2, 0]} intensity={1.5} distance={4} color="#FFE39A" castShadow />
      )}
    </group>
  );
}

// ─── FLOWER (Messages / Reasons) ────────────────────────────
function Flower({ interactive }: { interactive: boolean }) {
  return (
    <Interactable href="/jane" interactive={interactive} label="Jane Lore">
      <Float speed={0.7} floatIntensity={0.3} rotationIntensity={0.1}>
        <group position={[3.0, -0.2, -4.5]}>
          {/* Stem */}
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.4, 6]} />
            <meshLambertMaterial color="#5D8A3C" />
          </mesh>
          {/* Petals */}
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(angle) * 0.14, 0, Math.sin(angle) * 0.14]}>
                <sphereGeometry args={[0.1, 6, 6]} />
                <meshLambertMaterial color="#FFB7C5" />
              </mesh>
            );
          })}
          {/* Center */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshLambertMaterial color="#FFE39A" />
          </mesh>
        </group>
      </Float>
    </Interactable>
  );
}

// ─── SCENE ───────────────────────────────────────────────────
function Scene({ interactive }: { interactive: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={55} />
      <OrbitControls
        enablePan={false}
        enableZoom={interactive}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
        target={[0, 0, -2]}
      />

      {/* Lighting */}
      <ambientLight intensity={0.7} color="#FFF5E8" />
      <directionalLight position={[4, 6, 2]} intensity={0.8} color="#FFF5E8" castShadow />
      <pointLight position={[-2, 3, 0]} intensity={0.4} color="#FFB7C5" />
      <pointLight position={[2, 2, -4]} intensity={0.3} color="#C9C2FF" />

      {/* Fog for depth */}
      <fog attach="fog" args={["#F8F3EA", 8, 18]} />

      {/* Room */}
      <RoomGeometry />

      {/* Objects */}
      <TeddyBear interactive={interactive} />
      <Envelope interactive={interactive} />
      <Headphones interactive={interactive} />
      <Camera3D interactive={interactive} />
      <Plant interactive={interactive} />
      <VinylRecord interactive={interactive} />
      <TinyComputer interactive={interactive} />
      <Lamp />
      <Flower interactive={interactive} />
      <FloatingStars />
    </>
  );
}

// ─── LOADING FALLBACK ────────────────────────────────────────
function LoadingFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#C9C2FF]/20 to-[#FFB7C5]/20 rounded-xl">
      <span className="text-5xl animate-float">🏠</span>
      <p className="font-hand text-lg text-[#171717]/50">setting up our room...</p>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────
export default function OurRoom3D({ interactive = true }: OurRoom3DProps) {
  const [webGLError, setWebGLError] = useState(false);

  if (webGLError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#C9C2FF]/20 to-[#FFB7C5]/20">
        <div className="text-6xl">🏠</div>
        <p className="font-hand text-xl">our little room</p>
        <p className="font-body text-sm text-[#171717]/50">webgl not available on this device</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[320px] rounded-xl overflow-hidden">
      <Canvas
        shadows
        dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          if (!gl) setWebGLError(true);
        }}
        style={{ background: "linear-gradient(to bottom, #E8E4FF, #FFE8EF)" }}
      >
        <Suspense fallback={null}>
          <Scene interactive={interactive} />
        </Suspense>
      </Canvas>

      {interactive && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-wrap gap-2 justify-center">
          {[
            { label: "🧸 jane lore", href: "/jane" },
            { label: "💌 letters", href: "/letters" },
            { label: "🎧 music", href: "/music" },
            { label: "📸 memories", href: "/memories" },
            { label: "🎁 surprises", href: "/surprises" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="bg-[#FFFDF8]/90 border-2 border-[#171717] rounded-lg px-3 py-1 text-xs font-display font-bold shadow-[2px_2px_0px_#171717] hover:-translate-y-0.5 hover:shadow-[2px_4px_0px_#171717] transition-all"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
