"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Float,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";

interface OurRoom3DProps {
  interactive?: boolean;
}

// ─── ROOM GEOMETRY & ARCHITECTURE (Cozy Enclosed Diorama) ────
function CozyDioramaRoom() {
  return (
    <group position={[0, -1.2, -1]}>
      {/* 1. Thick Diorama Floor Base */}
      <RoundedBox args={[11, 0.4, 11]} radius={0.08} smoothness={4} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#2C241E" roughness={0.7} />
      </RoundedBox>

      {/* Main Wood Plank Floor */}
      <mesh receiveShadow position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10.8, 10.8]} />
        <meshStandardMaterial color="#EAD7C0" roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Floor Wood Plank Stripes */}
      {[-4, -2, 0, 2, 4].map((x) => (
        <mesh key={x} position={[x, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.03, 10.8]} />
          <meshStandardMaterial color="#D4BEA3" roughness={0.8} />
        </mesh>
      ))}

      {/* 2. Cozy Fluffy Center Rug */}
      <group position={[0, 0.04, 0.5]}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.6, 32]} />
          <meshStandardMaterial color="#FFDFE5" roughness={0.9} />
        </mesh>
        {/* Rug Inner Ring */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.005]}>
          <ringGeometry args={[2.2, 2.4, 32]} />
          <meshStandardMaterial color="#FFF5F7" roughness={0.9} />
        </mesh>
      </group>

      {/* 3. Back Wall (Soft Warm Cream) */}
      <mesh receiveShadow position={[0, 3, -5.4]}>
        <boxGeometry args={[11, 6, 0.3]} />
        <meshStandardMaterial color="#FFF9F2" roughness={0.8} />
      </mesh>

      {/* Back Wall Pastel Wallpaper Trim / Wainscoting */}
      <mesh position={[0, 1.2, -5.24]}>
        <boxGeometry args={[10.9, 2.4, 0.05]} />
        <meshStandardMaterial color="#FFEFF2" roughness={0.8} />
      </mesh>
      {/* Skirting Board (Back) */}
      <mesh position={[0, 0.15, -5.2]}>
        <boxGeometry args={[10.9, 0.3, 0.1]} />
        <meshStandardMaterial color="#E2CEBA" roughness={0.5} />
      </mesh>
      {/* Wall Molding Strip */}
      <mesh position={[0, 2.4, -5.2]}>
        <boxGeometry args={[10.9, 0.08, 0.06]} />
        <meshStandardMaterial color="#FFB8C6" roughness={0.5} />
      </mesh>

      {/* 4. Left Wall (Soft Lavender Pastel) */}
      <mesh receiveShadow position={[-5.4, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[11, 6, 0.3]} />
        <meshStandardMaterial color="#F7F4FF" roughness={0.8} />
      </mesh>
      {/* Left Wall Wainscoting */}
      <mesh position={[-5.24, 1.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10.9, 2.4, 0.05]} />
        <meshStandardMaterial color="#EDE7FF" roughness={0.8} />
      </mesh>
      {/* Skirting Board (Left) */}
      <mesh position={[-5.2, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10.9, 0.3, 0.1]} />
        <meshStandardMaterial color="#E2CEBA" roughness={0.5} />
      </mesh>
      {/* Wall Molding Strip (Left) */}
      <mesh position={[-5.2, 2.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10.9, 0.08, 0.06]} />
        <meshStandardMaterial color="#D4C8FF" roughness={0.5} />
      </mesh>

      {/* 5. Right Low Enclosure Wall (Keeps room cozy without blocking view) */}
      <mesh receiveShadow position={[5.4, 1.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[11, 2.4, 0.3]} />
        <meshStandardMaterial color="#FFF9F2" roughness={0.8} />
      </mesh>
      {/* Skirting Board (Right) */}
      <mesh position={[5.2, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10.9, 0.3, 0.1]} />
        <meshStandardMaterial color="#E2CEBA" roughness={0.5} />
      </mesh>

      {/* 6. Window on Back Wall with Warm Sunlight */}
      <group position={[2.2, 3.6, -5.2]}>
        {/* Outer Frame */}
        <RoundedBox args={[2.4, 2.2, 0.12]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color="#FFFDF9" roughness={0.5} />
        </RoundedBox>
        {/* Glass Glow */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[2.1, 1.9]} />
          <meshBasicMaterial color="#BAE6FD" />
        </mesh>
        {/* Window Crossbars */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[0.08, 1.9, 0.04]} />
          <meshStandardMaterial color="#FFFDF9" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[2.1, 0.08, 0.04]} />
          <meshStandardMaterial color="#FFFDF9" />
        </mesh>
        {/* Window Sill */}
        <mesh position={[0, -1.05, 0.1]}>
          <boxGeometry args={[2.6, 0.1, 0.25]} />
          <meshStandardMaterial color="#E2CEBA" />
        </mesh>
      </group>

      {/* 7. Fairy String Lights along Back Wall */}
      <group position={[0, 4.8, -5.15]}>
        {[-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((x, i) => (
          <group key={i} position={[x, Math.sin(i * 0.8) * 0.12, 0]}>
            <mesh>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshBasicMaterial color={i % 2 === 0 ? "#FEF08A" : "#FFCCD5"} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 8. Cozy Shelf on Left Wall */}
      <group position={[-5.15, 3.2, -1.5]}>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[2.5, 0.08, 0.4]} />
          <meshStandardMaterial color="#D7C3AD" roughness={0.6} />
        </mesh>
        {/* Shelf Books */}
        {[-0.8, -0.55, -0.3, 0.2, 0.5].map((z, idx) => (
          <mesh key={idx} position={[0.05, 0.3, z]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.18, 0.5, 0.35]} />
            <meshStandardMaterial
              color={idx === 0 ? "#FFCCD5" : idx === 1 ? "#FEF08A" : idx === 2 ? "#D8D2FF" : "#BAE6FD"}
              roughness={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* 9. Framed Polaroid on Back Wall */}
      <group position={[-2.5, 3.8, -5.2]}>
        <mesh rotation={[0, 0, 0.05]}>
          <boxGeometry args={[1.2, 1.4, 0.04]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.1, 0.025]} rotation={[0, 0, 0.05]}>
          <planeGeometry args={[1.0, 0.9]} />
          <meshBasicMaterial color="#FFCCD5" />
        </mesh>
      </group>
    </group>
  );
}

// ─── INTERACTION WRAPPER ─────────────────────────────────────
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

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = hovered ? 1.15 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={interactive ? () => router.push(href) : undefined}
      onPointerEnter={
        interactive
          ? (e) => {
              e.stopPropagation();
              setHovered(true);
              document.body.style.cursor = "pointer";
            }
          : undefined
      }
      onPointerLeave={
        interactive
          ? () => {
              setHovered(false);
              document.body.style.cursor = "auto";
            }
          : undefined
      }
    >
      {children}
    </group>
  );
}

// ─── OBJECTS (Cute Stylized 3D Props) ─────────────────────────

// 1. Teddy Bear (Jane Lore)
function TeddyBear({ interactive }: { interactive: boolean }) {
  return (
    <Interactable href="/jane" interactive={interactive} label="Jane Lore">
      <Float speed={1.2} floatIntensity={0.25} rotationIntensity={0.1}>
        <group position={[-1.6, -0.65, 0.2]}>
          {/* Body */}
          <mesh castShadow position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.38, 20, 20]} />
            <meshStandardMaterial color="#C48858" roughness={0.8} />
          </mesh>
          {/* Head */}
          <mesh castShadow position={[0, 0.72, 0]}>
            <sphereGeometry args={[0.3, 20, 20]} />
            <meshStandardMaterial color="#C48858" roughness={0.8} />
          </mesh>
          {/* Snout */}
          <mesh position={[0, 0.67, 0.22]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#EAD7C0" roughness={0.8} />
          </mesh>
          {/* Nose */}
          <mesh position={[0, 0.72, 0.32]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color="#23201D" />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.1, 0.78, 0.26]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#23201D" />
          </mesh>
          <mesh position={[0.1, 0.78, 0.26]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#23201D" />
          </mesh>
          {/* Ears */}
          <mesh position={[-0.24, 0.95, 0]}>
            <sphereGeometry args={[0.1, 14, 14]} />
            <meshStandardMaterial color="#C48858" roughness={0.8} />
          </mesh>
          <mesh position={[0.24, 0.95, 0]}>
            <sphereGeometry args={[0.1, 14, 14]} />
            <meshStandardMaterial color="#C48858" roughness={0.8} />
          </mesh>
          {/* Cute Pink Bowtie */}
          <mesh position={[0, 0.48, 0.28]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#FF8FAB" roughness={0.5} />
          </mesh>
        </group>
      </Float>
    </Interactable>
  );
}

// 2. Love Letter Envelope (Mailbox)
function Envelope({ interactive }: { interactive: boolean }) {
  return (
    <Interactable href="/letters" interactive={interactive} label="Mailbox">
      <Float speed={1.5} floatIntensity={0.3} rotationIntensity={0.2}>
        <group position={[-0.4, -0.7, 1.2]} rotation={[0.2, 0.3, 0.1]}>
          <RoundedBox args={[0.7, 0.48, 0.06]} radius={0.03} smoothness={4} castShadow>
            <meshStandardMaterial color="#FEF08A" roughness={0.5} />
          </RoundedBox>
          {/* Flap */}
          <mesh position={[0, 0.05, 0.035]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.3, 0.2, 3]} />
            <meshStandardMaterial color="#FDE047" roughness={0.5} />
          </mesh>
          {/* Red Heart Seal */}
          <mesh position={[0, 0.02, 0.05]}>
            <sphereGeometry args={[0.065, 12, 12]} />
            <meshStandardMaterial color="#FF4D6D" roughness={0.3} />
          </mesh>
        </group>
      </Float>
    </Interactable>
  );
}

// 3. Wooden Desk with Retro Computer (Secret Room)
function DeskAndComputer({ interactive }: { interactive: boolean }) {
  return (
    <group position={[2.8, -1.18, -3.2]}>
      {/* Desk Surface */}
      <RoundedBox args={[3.2, 0.15, 1.6]} radius={0.03} smoothness={4} position={[0, 1.2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#D7C3AD" roughness={0.5} />
      </RoundedBox>
      {/* Desk Legs */}
      {[-1.4, 1.4].map((x) =>
        [-0.65, 0.65].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.6, z]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1.2, 12]} />
            <meshStandardMaterial color="#A8947E" roughness={0.6} />
          </mesh>
        ))
      )}

      {/* Retro Computer Monitor on Desk */}
      <Interactable href="/secret" interactive={interactive} label="Secret Room">
        <Float speed={1.1} floatIntensity={0.15}>
          <group position={[-0.5, 1.7, -0.1]}>
            {/* Monitor Case */}
            <RoundedBox args={[0.85, 0.7, 0.45]} radius={0.06} smoothness={4} castShadow>
              <meshStandardMaterial color="#E8E2D8" roughness={0.5} />
            </RoundedBox>
            {/* Glowing CRT Screen */}
            <mesh position={[0, 0.02, 0.23]}>
              <planeGeometry args={[0.68, 0.52]} />
              <meshBasicMaterial color="#1E1B18" />
            </mesh>
            {/* Cute Green Prompt */}
            <mesh position={[-0.15, 0.08, 0.235]}>
              <planeGeometry args={[0.25, 0.05]} />
              <meshBasicMaterial color="#4ADE80" />
            </mesh>
            {/* Stand */}
            <mesh position={[0, -0.4, 0]}>
              <cylinderGeometry args={[0.08, 0.15, 0.15, 12]} />
              <meshStandardMaterial color="#D1C8BC" />
            </mesh>
          </group>
        </Float>
      </Interactable>
    </group>
  );
}

// 4. Headphones (Soundtrack)
function Headphones({ interactive }: { interactive: boolean }) {
  return (
    <Interactable href="/music" interactive={interactive} label="Music">
      <Float speed={1.3} floatIntensity={0.25} rotationIntensity={0.15}>
        <group position={[1.8, 0.2, -2.8]} rotation={[0.2, -0.4, 0]}>
          {/* Headband */}
          <mesh>
            <torusGeometry args={[0.25, 0.03, 12, 24, Math.PI]} />
            <meshStandardMaterial color="#23201D" roughness={0.4} />
          </mesh>
          {/* Left Earcup */}
          <mesh position={[-0.26, -0.05, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.07, 16]} />
            <meshStandardMaterial color="#D8D2FF" roughness={0.4} />
          </mesh>
          {/* Right Earcup */}
          <mesh position={[0.26, -0.05, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.07, 16]} />
            <meshStandardMaterial color="#FFCCD5" roughness={0.4} />
          </mesh>
        </group>
      </Float>
    </Interactable>
  );
}

// 5. Polaroid Camera (Memories)
function Camera3D({ interactive }: { interactive: boolean }) {
  return (
    <Interactable href="/memories" interactive={interactive} label="Memories">
      <Float speed={1} floatIntensity={0.25}>
        <group position={[0.8, -0.85, 0.8]} rotation={[-0.1, -0.3, 0]}>
          {/* Camera Body */}
          <RoundedBox args={[0.6, 0.42, 0.26]} radius={0.05} smoothness={4} castShadow>
            <meshStandardMaterial color="#23201D" roughness={0.6} />
          </RoundedBox>
          {/* Lens Ring */}
          <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.08, 20]} />
            <meshStandardMaterial color="#A8A199" roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Lens Glass */}
          <mesh position={[0, 0, 0.21]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.02, 20]} />
            <meshBasicMaterial color="#BAE6FD" />
          </mesh>
          {/* Flash Strip */}
          <mesh position={[0.18, 0.12, 0.14]}>
            <boxGeometry args={[0.12, 0.07, 0.02]} />
            <meshBasicMaterial color="#FEF08A" />
          </mesh>
        </group>
      </Float>
    </Interactable>
  );
}

// 6. Cute Plant Pot (Surprises)
function Plant({ interactive }: { interactive: boolean }) {
  return (
    <Interactable href="/surprises" interactive={interactive} label="Surprises">
      <Float speed={0.9} floatIntensity={0.15}>
        <group position={[-3.8, -0.65, -3.2]}>
          {/* Pot */}
          <mesh castShadow position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.26, 0.2, 0.45, 18]} />
            <meshStandardMaterial color="#FFAAA6" roughness={0.6} />
          </mesh>
          {/* Soil */}
          <mesh position={[0, 0.43, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.04, 18]} />
            <meshStandardMaterial color="#4A3B32" roughness={0.9} />
          </mesh>
          {/* Leaves */}
          {[
            [0, 0.65, 0, 0.25],
            [-0.15, 0.55, 0.1, 0.2],
            [0.15, 0.58, -0.1, 0.22],
            [0.1, 0.52, 0.14, 0.18],
          ].map(([x, y, z, r], i) => (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[r, 14, 14]} />
              <meshStandardMaterial color={i === 0 ? "#86EFAC" : "#4ADE80"} roughness={0.7} />
            </mesh>
          ))}
        </group>
      </Float>
    </Interactable>
  );
}

// 7. Cozy Floor Lamp (Ambient Glow)
function Lamp() {
  return (
    <group position={[-4.2, -1.18, 1.8]}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.1, 18]} />
        <meshStandardMaterial color="#23201D" roughness={0.5} />
      </mesh>
      {/* Stand Pole */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 3, 12]} />
        <meshStandardMaterial color="#E2CEBA" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Shade */}
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.28, 0.45, 0.5, 20, 1, true]} />
        <meshStandardMaterial color="#FEF08A" roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Glowing Bulb */}
      <mesh position={[0, 2.75, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>
      {/* Warm Point Light */}
      <pointLight position={[0, 2.7, 0]} intensity={1.2} distance={6} decay={2} color="#FEF08A" />
    </group>
  );
}

// ─── COMPLETE 3D SCENE ───────────────────────────────────────
function Scene({ interactive }: { interactive: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[4.5, 4.2, 7.5]} fov={48} />
      <OrbitControls
        enablePan={false}
        enableZoom={interactive}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.25}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 2.5}
        target={[0, 0.2, -0.5]}
      />

      {/* Upgraded Warm Cozy Lighting */}
      <ambientLight intensity={0.9} color="#FFF6EE" />
      <directionalLight
        position={[6, 9, 4]}
        intensity={1.1}
        color="#FFF3E0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      {/* Soft Pastel Fill Light */}
      <pointLight position={[-3, 4, 2]} intensity={0.5} color="#FFD1DC" />
      <pointLight position={[3, 3, -3]} intensity={0.4} color="#BAE6FD" />

      {/* Room Enclosure */}
      <CozyDioramaRoom />

      {/* Furniture & Objects */}
      <TeddyBear interactive={interactive} />
      <Envelope interactive={interactive} />
      <DeskAndComputer interactive={interactive} />
      <Headphones interactive={interactive} />
      <Camera3D interactive={interactive} />
      <Plant interactive={interactive} />
      <Lamp />
    </>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────
export default function OurRoom3D({ interactive = true }: OurRoom3DProps) {
  const [webGLError, setWebGLError] = useState(false);

  if (webGLError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#FAF5EE]">
        <div className="text-6xl">🏠</div>
        <p className="font-hand text-xl">our little room</p>
        <p className="font-body text-sm text-[#6E675F]">webgl not available on this device</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[340px] rounded-2xl overflow-hidden relative">
      <Canvas
        shadows
        dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          if (!gl) setWebGLError(true);
        }}
        style={{ background: "#FAF5EE" }}
      >
        <Suspense fallback={null}>
          <Scene interactive={interactive} />
        </Suspense>
      </Canvas>

      {interactive && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap gap-1.5 justify-center z-10 pointer-events-none">
          {[
            { label: "🧸 Jane Lore", href: "/jane" },
            { label: "💌 Letters", href: "/letters" },
            { label: "🎧 Music", href: "/music" },
            { label: "📸 Memories", href: "/memories" },
            { label: "🎁 Surprises", href: "/surprises" },
            { label: "🖥️ Secret", href: "/secret" },
          ].map((item) => (
            <span
              key={item.href}
              className="badge-pill bg-[#FFFFFF]/90 text-[10px] shadow-sm"
            >
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
