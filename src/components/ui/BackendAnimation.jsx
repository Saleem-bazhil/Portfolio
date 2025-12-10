// src/components/BackendAnimation.jsx
import * as THREE from "three";
import { memo, useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Image,
  ScrollControls,
  useScroll,
  useTexture,
  RoundedBox,
  Float,
} from "@react-three/drei";
import { easing } from "maath";
import "../scrollanimation/util";

// BACKEND SKILLS – replace with backend icons when ready
const SKILLS = [
  { url: "/skills/html.png", scale: 1.6 },
  { url: "/skills/css.jpeg", scale: 1.6 },
  { url: "/skills/js.jpeg", scale: 1.55 },
  { url: "/skills/react.png", scale: 1.65 },
  { url: "/skills/python.png", scale: 1.6 },
  { url: "/skills/django.png", scale: 1.6 },
];

const CAMERA_Z = 21.5;
// how far left the ring sits. More negative = further left.
const RING_X = -4.6;

// Reused scale targets
const NORMAL_SCALE = [1, 1, 1];
const HOVER_SCALE = [1.08, 1.08, 1.08];

/* ------------------------------
   🎨 Canvas Wrapper (Memoized)
------------------------------- */
const BackendAnimation = memo(function BackendAnimation() {
  return (
    <Canvas
      className="w-full h-full"
      dpr={[0.85, 1.1]} // slightly lighter for performance
      camera={{ position: [0, 0, CAMERA_Z], fov: 26 }}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => e.preventDefault(),
          false
        );
      }}
    >
      <Scene />
    </Canvas>
  );
});

export default BackendAnimation;

/* ------------------------------
   🌌 Scene: Lights + Controls
------------------------------- */
function Scene() {
  return (
    <>
      {/* slightly brighter ambient so cubes don’t disappear */}
      <ambientLight intensity={0.9} color="#00f0aa" />
      <directionalLight position={[6, 10, 8]} intensity={1.15} color="#00e1ff" />
      <pointLight position={[-4, -2, 6]} intensity={0.45} color="#00d9aa" />
      <directionalLight position={[8, 4, 4]} intensity={0.45} color="#38bdf8" />

      <fog attach="fog" args={["#04130f", 20, 55]} />

      <ScrollControls pages={4} infinite>
        {/* Ring on the left side */}
        <Rig position={[RING_X, -0.25, 0]}>
          <Carousel />
        </Rig>

        <Banner position={[RING_X, -0.08, 0]} />
      </ScrollControls>
    </>
  );
}

/* ------------------------------
   🔄 Rig (rotation + camera)
------------------------------- */
const Rig = memo(function Rig({ children, position }) {
  const ref = useRef();
  const scroll = useScroll();
  const autoRotation = useRef(0);

  const BASE_TILT_X = -0.28;
  const BASE_TILT_Z = -0.04;
  const BASE_Y_OFFSET = Math.PI / 7;

  useFrame((state, delta) => {
    if (!ref.current) return;

    autoRotation.current += delta * 0.13;
    const scrollRotation = -scroll.offset * (Math.PI * 2);

    ref.current.rotation.set(
      BASE_TILT_X,
      BASE_Y_OFFSET + autoRotation.current + scrollRotation,
      BASE_TILT_Z
    );

    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 0.85, state.pointer.y * 0.3, CAMERA_Z],
      0.28,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
});

/* ------------------------------
   🎠 Carousel (ring of cards)
------------------------------- */
const Carousel = memo(function Carousel({ radius = 3.2 }) {
  const count = SKILLS.length;

  const items = useMemo(
    () =>
      SKILLS.map((skill, i) => {
        const angle = (i / count) * Math.PI * 2;
        return {
          key: skill.url + i,
          url: skill.url,
          scale: skill.scale,
          position: [Math.sin(angle) * radius, 0.23, Math.cos(angle) * radius],
          rotation: [0, Math.PI + angle, 0],
        };
      }),
    [radius, count]
  );

  return (
    <group>
      {items.map((item) => (
        <Card
          key={item.key}
          url={item.url}
          iconScale={item.scale}
          position={item.position}
          rotation={item.rotation}
        />
      ))}
    </group>
  );
});

/* ------------------------------
   🃏 Card (hover + float)
------------------------------- */
const Card = memo(function Card({ url, iconScale, ...props }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  const handleOver = useCallback((e) => {
    e.stopPropagation();
    setHovered(true);
  }, []);

  const handleOut = useCallback(() => {
    setHovered(false);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    easing.damp3(
      groupRef.current.scale,
      hovered ? HOVER_SCALE : NORMAL_SCALE,
      0.22,
      delta
    );
  });

  return (
    <Float
      floatIntensity={0.22}
      rotationIntensity={0.14}
      speed={hovered ? 1.5 : 1.05}
    >
      <group
        ref={groupRef}
        {...props}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
      >
        <RoundedBox args={[1.65, 2.3, 0.16]} radius={0.48} smoothness={6}>
          <meshStandardMaterial
            color="#020617"
            metalness={0.3}
            roughness={0.3}
            emissive="#020617"
            emissiveIntensity={0.45}
          />
        </RoundedBox>

        {/* Front */}
        <Image
          url={url}
          scale={[iconScale, iconScale, 1]}
          position={[0, 0, 0.14]}
          transparent
          toneMapped={false}
          side={THREE.FrontSide}
        />
        {/* Back */}
        <Image
          url={url}
          scale={[iconScale, iconScale, 1]}
          position={[0, 0, -0.14]}
          rotation={[0, Math.PI, 0]}
          transparent
          toneMapped={false}
          side={THREE.FrontSide}
        />
      </group>
    </Float>
  );
});

/* ------------------------------
   🔥 Banner (sine animated band)
------------------------------- */
const Banner = memo(function Banner(props) {
  const ref = useRef();
  const scroll = useScroll();

  const texture = useTexture("/skills/logo fr.png");

  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  }, [texture]);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh || !mesh.material) return;

    mesh.material.time.value += Math.abs(scroll.delta) * 3.0;
    mesh.material.map.offset.x += delta / 2.7;
  });

  const RADIUS = 2.9;

  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[RADIUS, RADIUS, 0.22, 96, 12, true]} />
      <meshSineMaterial
        map={texture}
        map-repeat={[11, 1]}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
});
