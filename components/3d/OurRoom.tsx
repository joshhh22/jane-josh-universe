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

export type TimeMode = "day" | "sunset" | "night";

interface OurRoom3DProps {
  interactive?: boolean;
}

// ─── ROOM GEOMETRY & ARCHITECTURE ────────────────────────────
function CozyDioramaRoom({ timeMode }: { timeMode: TimeMode }) {
  const isNight = timeMode === "night";
  const isSunset = timeMode === "sunset";

  return (
    <group position={[0, -1.2, -1]}>
      {/* 1. Thick Diorama Floor Base */}
      <RoundedBox args={[11, 0.4, 11]} radius={0.08} smoothness={4} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#2C241E" roughness={0.7} />
      </RoundedBox>

      {/* Main Wood Plank Floor */}
      <mesh receiveShadow position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10.8, 10.8]} />
        <meshStandardMaterial
          color={isNight ? "#C2A88F" : isSunset ? "#DEB896" : "#EAD7C0"}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Floor Wood Plank Lines */}
      {[-4, -2, 0, 2, 4].map((x) => (
        <mesh key={x} position={[x, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.03, 10.8]} />
          <meshStandardMaterial color="#A88B70" roughness={0.8} />
        </mesh>
      ))}

      {/* 2. Cozy Fluffy Center Rug */}
      <group position={[0, 0.04, 0.4]}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.5, 32]} />
          <meshStandardMaterial
            color={isNight ? "#D4A5B8" : isSunset ? "#FCA5A5" : "#FFDFE5"}
            roughness={0.9}
          />
        </mesh>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.005]}>
          <ringGeometry args={[2.1, 2.35, 32]} />
          <meshStandardMaterial color="#FFF5F7" roughness={0.9} />
        </mesh>
      </group>

      {/* 3. Back Wall */}
      <mesh receiveShadow position={[0, 3, -5.4]}>
        <boxGeometry args={[11, 6, 0.3]} />
        <meshStandardMaterial
          color={isNight ? "#2D283E" : isSunset ? "#FFF0E5" : "#FFF9F2"}
          roughness={0.8}
        />
      </mesh>

      {/* Back Wall Wainscoting */}
      <mesh position={[0, 1.2, -5.24]}>
        <boxGeometry args={[10.9, 2.4, 0.05]} />
        <meshStandardMaterial
          color={isNight ? "#3C3552" : isSunset ? "#FFD8CC" : "#FFEFF2"}
          roughness={0.8}
        />
      </mesh>
      {/* Skirting Board (Back) */}
      <mesh position={[0, 0.15, -5.2]}>
        <boxGeometry args={[10.9, 0.3, 0.1]} />
        <meshStandardMaterial color="#9C836A" roughness={0.5} />
      </mesh>
      {/* Wall Molding Strip */}
      <mesh position={[0, 2.4, -5.2]}>
        <boxGeometry args={[10.9, 0.08, 0.06]} />
        <meshStandardMaterial color={isNight ? "#9D8BB0" : "#FFB8C6"} roughness={0.5} />
      </mesh>

      {/* 4. Left Wall */}
      <mesh receiveShadow position={[-5.4, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[11, 6, 0.3]} />
        <meshStandardMaterial
          color={isNight ? "#272236" : isSunset ? "#F5E0D3" : "#F7F4FF"}
          roughness={0.8}
        />
      </mesh>
      {/* Left Wall Wainscoting */}
      <mesh position={[-5.24, 1.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10.9, 2.4, 0.05]} />
        <meshStandardMaterial
          color={isNight ? "#352F48" : isSunset ? "#EBD0C2" : "#EDE7FF"}
          roughness={0.8}
        />
      </mesh>
      {/* Skirting Board (Left) */}
      <mesh position={[-5.2, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10.9, 0.3, 0.1]} />
        <meshStandardMaterial color="#9C836A" roughness={0.5} />
      </mesh>
      {/* Wall Molding Strip (Left) */}
      <mesh position={[-5.2, 2.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10.9, 0.08, 0.06]} />
        <meshStandardMaterial color={isNight ? "#9D8BB0" : "#D4C8FF"} roughness={0.5} />
      </mesh>

      {/* 5. Right Wall (Half Wall) */}
      <mesh receiveShadow position={[5.4, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[11, 3.0, 0.3]} />
        <meshStandardMaterial
          color={isNight ? "#2D283E" : isSunset ? "#FFF0E5" : "#FFF9F2"}
          roughness={0.8}
        />
      </mesh>
      {/* Skirting Board (Right) */}
      <mesh position={[5.2, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10.9, 0.3, 0.1]} />
        <meshStandardMaterial color="#9C836A" roughness={0.5} />
      </mesh>

      {/* 6. Window on Back Wall */}
      <group position={[1.8, 3.8, -5.2]}>
        <RoundedBox args={[2.4, 2.0, 0.12]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color={isNight ? "#E2E8F0" : "#FFFDF9"} roughness={0.5} />
        </RoundedBox>
        {/* Sky pane in window */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[2.1, 1.7]} />
          <meshBasicMaterial
            color={isNight ? "#0F172A" : isSunset ? "#F97316" : "#BAE6FD"}
          />
        </mesh>

        {/* Night Window Stars & Moon */}
        {isNight && (
          <group position={[0, 0, 0.025]}>
            {/* Crescent Moon */}
            <mesh position={[0.5, 0.45, 0]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshBasicMaterial color="#FEF08A" />
            </mesh>
            {/* Window Stars */}
            {[-0.6, -0.2, 0.1, -0.5, 0.7].map((x, i) => (
              <mesh key={i} position={[x, (i % 2 === 0 ? 0.3 : -0.2) + i * 0.1, 0]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            ))}
          </group>
        )}

        {/* Window Crossbars */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[0.08, 1.7, 0.04]} />
          <meshStandardMaterial color="#FFFDF9" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[2.1, 0.08, 0.04]} />
          <meshStandardMaterial color="#FFFDF9" />
        </mesh>
        <mesh position={[0, -0.95, 0.1]}>
          <boxGeometry args={[2.6, 0.1, 0.25]} />
          <meshStandardMaterial color="#9C836A" />
        </mesh>
      </group>

      {/* 7. Fairy String Lights */}
      <group position={[0, 4.8, -5.15]}>
        {[-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((x, i) => (
          <group key={i} position={[x, Math.sin(i * 0.8) * 0.12, 0]}>
            <mesh>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshBasicMaterial color={i % 2 === 0 ? "#FEF08A" : "#FFCCD5"} />
            </mesh>
            {isNight && (
              <pointLight
                position={[0, 0, 0.1]}
                intensity={0.2}
                distance={1.5}
                color="#FEF08A"
              />
            )}
          </group>
        ))}
      </group>

      {/* 8. Bookshelf on Left Wall */}
      <group position={[-5.15, 3.2, -1.5]}>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[2.5, 0.08, 0.4]} />
          <meshStandardMaterial color="#9C836A" roughness={0.6} />
        </mesh>
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

      {/* 9. Framed Wall Art */}
      <group position={[-2.2, 3.8, -5.2]}>
        <mesh rotation={[0, 0, 0.04]}>
          <boxGeometry args={[1.2, 1.4, 0.04]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.1, 0.025]} rotation={[0, 0, 0.04]}>
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
      const targetScale = hovered ? 1.12 : 1;
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

// ─── 3D PROPS & FURNITURE ────────────────────────────────────

// 1. Teddy Bear (Jane Lore)
function TeddyBear({ interactive }: { interactive: boolean }) {
  return (
    <Interactable href="/jane" interactive={interactive} label="Jane Lore">
      <Float speed={1.2} floatIntensity={0.2} rotationIntensity={0.08}>
        <group position={[-0.9, -0.65, 0.3]} rotation={[0, 0.3, 0]}>
          <mesh castShadow position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.38, 20, 20]} />
            <meshStandardMaterial color="#C48858" roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 0.72, 0]}>
            <sphereGeometry args={[0.3, 20, 20]} />
            <meshStandardMaterial color="#C48858" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.67, 0.22]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#EAD7C0" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.72, 0.32]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color="#23201D" />
          </mesh>
          <mesh position={[-0.1, 0.78, 0.26]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#23201D" />
          </mesh>
          <mesh position={[0.1, 0.78, 0.26]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#23201D" />
          </mesh>
          <mesh position={[-0.24, 0.95, 0]}>
            <sphereGeometry args={[0.1, 14, 14]} />
            <meshStandardMaterial color="#C48858" roughness={0.8} />
          </mesh>
          <mesh position={[0.24, 0.95, 0]}>
            <sphereGeometry args={[0.1, 14, 14]} />
            <meshStandardMaterial color="#C48858" roughness={0.8} />
          </mesh>
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
      <Float speed={1.4} floatIntensity={0.25} rotationIntensity={0.15}>
        <group position={[0.6, -0.65, 0.8]} rotation={[0.2, -0.2, 0.1]}>
          <RoundedBox args={[0.7, 0.48, 0.06]} radius={0.03} smoothness={4} castShadow>
            <meshStandardMaterial color="#FEF08A" roughness={0.5} />
          </RoundedBox>
          <mesh position={[0, 0.05, 0.035]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.3, 0.2, 3]} />
            <meshStandardMaterial color="#FDE047" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.02, 0.05]}>
            <sphereGeometry args={[0.065, 12, 12]} />
            <meshStandardMaterial color="#FF4D6D" roughness={0.3} />
          </mesh>
        </group>
      </Float>
    </Interactable>
  );
}

// 3. Wooden Desk with Retro Computer
function DeskAndComputer({ interactive }: { interactive: boolean }) {
  return (
    <group position={[2.0, -1.18, -3.2]}>
      {/* Desk Surface */}
      <RoundedBox args={[3.2, 0.14, 1.6]} radius={0.03} smoothness={4} position={[0, 1.2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#9C836A" roughness={0.5} />
      </RoundedBox>
      {/* Desk Legs */}
      {[-1.4, 1.4].map((x) =>
        [-0.65, 0.65].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.6, z]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.2, 12]} />
            <meshStandardMaterial color="#7A6550" roughness={0.6} />
          </mesh>
        ))
      )}

      {/* Retro Computer */}
      <Interactable href="/secret" interactive={interactive} label="Secret Room">
        <Float speed={1.0} floatIntensity={0.1}>
          <group position={[-0.2, 1.7, -0.1]}>
            <RoundedBox args={[0.88, 0.72, 0.45]} radius={0.06} smoothness={4} castShadow>
              <meshStandardMaterial color="#E8E2D8" roughness={0.5} />
            </RoundedBox>
            <mesh position={[0, 0.02, 0.23]}>
              <planeGeometry args={[0.7, 0.54]} />
              <meshBasicMaterial color="#1E1B18" />
            </mesh>
            <mesh position={[-0.15, 0.08, 0.235]}>
              <planeGeometry args={[0.28, 0.05]} />
              <meshBasicMaterial color="#4ADE80" />
            </mesh>
            <mesh position={[0, -0.42, 0]}>
              <cylinderGeometry args={[0.1, 0.16, 0.14, 12]} />
              <meshStandardMaterial color="#D1C8BC" />
            </mesh>
            <mesh position={[0, -0.42, 0.45]} rotation={[-0.1, 0, 0]}>
              <boxGeometry args={[0.75, 0.05, 0.3]} />
              <meshStandardMaterial color="#E8E2D8" />
            </mesh>
          </group>
        </Float>
      </Interactable>

      {/* Headphone Stand */}
      <Interactable href="/music" interactive={interactive} label="Music">
        <Float speed={1.1} floatIntensity={0.15}>
          <group position={[1.1, 1.55, 0]} rotation={[0, -0.4, 0]}>
            <mesh position={[0, -0.28, 0]}>
              <cylinderGeometry args={[0.12, 0.14, 0.04, 16]} />
              <meshStandardMaterial color="#23201D" />
            </mesh>
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.45, 12]} />
              <meshStandardMaterial color="#23201D" />
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <torusGeometry args={[0.22, 0.025, 12, 24, Math.PI]} />
              <meshStandardMaterial color="#23201D" roughness={0.4} />
            </mesh>
            <mesh position={[-0.23, 0.08, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
              <meshStandardMaterial color="#D8D2FF" roughness={0.4} />
            </mesh>
            <mesh position={[0.23, 0.08, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
              <meshStandardMaterial color="#FFCCD5" roughness={0.4} />
            </mesh>
          </group>
        </Float>
      </Interactable>
    </group>
  );
}

// 4. Side Table with Polaroid Camera
function SideTableAndCamera({ interactive }: { interactive: boolean }) {
  return (
    <group position={[-2.8, -1.18, -3.2]}>
      <RoundedBox args={[1.4, 0.12, 1.4]} radius={0.03} smoothness={4} position={[0, 0.85, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#9C836A" roughness={0.5} />
      </RoundedBox>
      {[-0.55, 0.55].map((x) =>
        [-0.55, 0.55].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.42, z]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.85, 12]} />
            <meshStandardMaterial color="#7A6550" roughness={0.6} />
          </mesh>
        ))
      )}

      {/* Polaroid Camera */}
      <Interactable href="/memories" interactive={interactive} label="Memories">
        <Float speed={1.1} floatIntensity={0.15}>
          <group position={[0, 1.25, 0]} rotation={[-0.05, 0.25, 0]}>
            <RoundedBox args={[0.62, 0.44, 0.3]} radius={0.05} smoothness={4} castShadow>
              <meshStandardMaterial color="#23201D" roughness={0.6} />
            </RoundedBox>
            <mesh position={[0, -0.05, 0.155]}>
              <boxGeometry args={[0.6, 0.08, 0.02]} />
              <meshStandardMaterial color="#BAE6FD" />
            </mesh>
            <mesh position={[0, 0.02, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.14, 0.14, 0.08, 20]} />
              <meshStandardMaterial color="#A8A199" roughness={0.3} metalness={0.4} />
            </mesh>
            <mesh position={[0, 0.02, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.02, 20]} />
              <meshBasicMaterial color="#BAE6FD" />
            </mesh>
            <mesh position={[0.18, 0.14, 0.16]}>
              <boxGeometry args={[0.12, 0.07, 0.02]} />
              <meshBasicMaterial color="#FEF08A" />
            </mesh>
          </group>
        </Float>
      </Interactable>
    </group>
  );
}

// 5. Cute Plant Pot
function Plant({ interactive }: { interactive: boolean }) {
  return (
    <Interactable href="/surprises" interactive={interactive} label="Surprises">
      <Float speed={0.9} floatIntensity={0.15}>
        <group position={[-4.2, -0.7, -1.8]}>
          <mesh castShadow position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.28, 0.22, 0.45, 18]} />
            <meshStandardMaterial color="#FFAAA6" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.43, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.04, 18]} />
            <meshStandardMaterial color="#4A3B32" roughness={0.9} />
          </mesh>
          {[
            [0, 0.65, 0, 0.26],
            [-0.16, 0.55, 0.1, 0.21],
            [0.16, 0.58, -0.1, 0.23],
            [0.11, 0.52, 0.15, 0.19],
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

// 6. Cozy Floor Lamp
function Lamp({ timeMode }: { timeMode: TimeMode }) {
  const isNight = timeMode === "night";
  const isSunset = timeMode === "sunset";

  return (
    <group position={[-3.8, -1.18, 1.8]}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.1, 18]} />
        <meshStandardMaterial color="#23201D" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 3, 12]} />
        <meshStandardMaterial color="#E2CEBA" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.28, 0.45, 0.5, 20, 1, true]} />
        <meshStandardMaterial
          color="#FEF08A"
          roughness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 2.75, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#FEF08A" />
      </mesh>
      <pointLight
        position={[0, 2.7, 0]}
        intensity={isNight ? 2.4 : isSunset ? 1.6 : 0.8}
        distance={7}
        decay={2}
        color="#FEF08A"
      />
    </group>
  );
}

// ─── COMPLETE 3D SCENE ───────────────────────────────────────
function Scene({ interactive, timeMode }: { interactive: boolean; timeMode: TimeMode }) {
  const isNight = timeMode === "night";
  const isSunset = timeMode === "sunset";

  return (
    <>
      <PerspectiveCamera makeDefault position={[4.2, 4.0, 7.2]} fov={48} />
      <OrbitControls
        enablePan={false}
        enableZoom={interactive}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.25}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 2.5}
        target={[0, 0.2, -0.5]}
      />

      {/* Dynamic Time-based Lighting */}
      <ambientLight
        intensity={isNight ? 0.35 : isSunset ? 0.75 : 0.9}
        color={isNight ? "#2E2A4A" : isSunset ? "#FFE4D6" : "#FFF6EE"}
      />

      {/* Sun / Moon Light */}
      <directionalLight
        position={isSunset ? [8, 4, 3] : [6, 9, 4]}
        intensity={isNight ? 0.4 : isSunset ? 1.4 : 1.15}
        color={isNight ? "#7DD3FC" : isSunset ? "#FB923C" : "#FFF3E0"}
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
      <pointLight
        position={[-3, 4, 2]}
        intensity={isNight ? 0.2 : 0.5}
        color={isNight ? "#93C5FD" : "#FFD1DC"}
      />
      <pointLight
        position={[3, 3, -3]}
        intensity={isNight ? 0.2 : 0.4}
        color={isNight ? "#C4B5FD" : "#BAE6FD"}
      />

      {/* Room Enclosure */}
      <CozyDioramaRoom timeMode={timeMode} />

      {/* Furniture & Objects */}
      <TeddyBear interactive={interactive} />
      <Envelope interactive={interactive} />
      <DeskAndComputer interactive={interactive} />
      <SideTableAndCamera interactive={interactive} />
      <Plant interactive={interactive} />
      <Lamp timeMode={timeMode} />
    </>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────
export default function OurRoom3D({ interactive = true }: OurRoom3DProps) {
  const [timeMode, setTimeMode] = useState<TimeMode>("day");
  const [webGLError, setWebGLError] = useState(false);

  const getCanvasBg = () => {
    if (timeMode === "night") return "#13111C";
    if (timeMode === "sunset") return "#FDF2E9";
    return "#FAF5EE";
  };

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
    <div className="w-full h-full min-h-[360px] rounded-2xl overflow-hidden relative transition-colors duration-500">
      {/* Time of Day Switcher (Top Right) */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-[#FFFFFF]/90 backdrop-blur-sm p-1 rounded-xl border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824]">
        {[
          { id: "day", label: "☀️ Day", color: "bg-[#FEF08A]" },
          { id: "sunset", label: "🌅 Sunset", color: "bg-[#FED7AA]" },
          { id: "night", label: "🌙 Night", color: "bg-[#DDD6FE]" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTimeMode(t.id as TimeMode)}
            className={`px-2.5 py-1 text-xs font-display font-bold rounded-lg transition-all ${
              timeMode === t.id
                ? `${t.color} text-[#2C2824] border border-[#2C2824] shadow-sm`
                : "text-[#7A7269] hover:text-[#2C2824]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Canvas
        shadows
        dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          if (!gl) setWebGLError(true);
        }}
        style={{ background: getCanvasBg() }}
      >
        <Suspense fallback={null}>
          <Scene interactive={interactive} timeMode={timeMode} />
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
