// 🚀 ScrollAnimation.jsx – tuned for look + performance (pure JS)
import * as THREE from "three";
import { memo, useRef, useState, useMemo } from "react";
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
import "./util";

// 💠 Skill Card Data (static → memo-friendly)
const SKILLS = [
  { url: "/skills/html.png", scale: 1.6 },
  { url: "/skills/css.jpeg", scale: 1.6 },
  { url: "/skills/js.jpeg", scale: 1.55 },
  { url: "/skills/react.png", scale: 1.65 },
  { url: "/skills/python.png", scale: 1.6 },
  { url: "/skills/django.png", scale: 1.6 },
];

// Camera back for full ring
const CAMERA_Z = 20.5;

/* ---------------------------
    🎨 Canvas Wrapper (Memoized)
----------------------------*/
const ScrollAnimation = memo(function ScrollAnimation() {
  return (
    <Canvas
      className="w-full h-full"
      dpr={[0.85, 1.1]} // safer range for GPUs
      camera={{ position: [0, 0, CAMERA_Z], fov: 26 }}
      gl={{
        alpha: true,
        antialias: false, // big performance win
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

/* ---------------------------
    🌌 All Scene Content
----------------------------*/
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 10, 8]} intensity={1.3} />
      <pointLight position={[-4, -2, 6]} intensity={0.4} />

      <fog attach="fog" args={["#0b0e14", 20, 50]} />

      <ScrollControls pages={4} infinite>
        {/* Slightly moved left to not hug the edge */}
        <Rig position={[3.0, -0.5, 0]}>
          <Carousel />
        </Rig>

        <Banner position={[3.0, -0.35, 0]} />
      </ScrollControls>
    </>
  );
}

/* -----------------------------------------------
    🔄 Rig (Auto-rotate + Scroll Rotate + Camera Tilt)
------------------------------------------------*/
const Rig = memo(function Rig({ children, position }) {
  const ref = useRef();
  const scroll = useScroll();
  const autoRotation = useRef(0);

  const BASE_TILT_X = -0.32;
  const BASE_TILT_Z = -0.08;
  const BASE_Y_OFFSET = Math.PI / 7;

  useFrame((state, delta) => {
    if (!ref.current) return;

    autoRotation.current += delta * 0.14;
    const scrollRotation = -scroll.offset * (Math.PI * 2);

    ref.current.rotation.set(
      BASE_TILT_X,
      BASE_Y_OFFSET + autoRotation.current + scrollRotation,
      BASE_TILT_Z
    );

    // smooth camera movement
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 1.0, state.pointer.y * 0.35, CAMERA_Z],
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

/* -----------------------------------------------
    🎠 Carousel (Ring of Cards)
------------------------------------------------*/
const Carousel = memo(function Carousel({ radius = 3.3 }) {
  const count = SKILLS.length;

  // Precompute positions so no math in render
  const cardPositions = useMemo(() => {
    return SKILLS.map((skill, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        ...skill,
        pos: [Math.sin(angle) * radius, 0.25, Math.cos(angle) * radius],
        rot: [0, Math.PI + angle, 0],
        key: skill.url + i,
      };
    });
  }, [count, radius]);

  return (
    <group>
      {cardPositions.map((item) => (
        <Card
          key={item.key}
          url={item.url}
          iconScale={item.scale}
          position={item.pos}
          rotation={item.rot}
        />
      ))}
    </group>
  );
});

/* -----------------------------------------------
    🃏 Card Component (optimized hover)
------------------------------------------------*/
const Card = memo(function Card({ url, iconScale, ...props }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  const onOver = (e) => {
    e.stopPropagation();
    setHovered(true);
  };

  const onOut = () => setHovered(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    easing.damp3(
      groupRef.current.scale,
      hovered ? [1.08, 1.08, 1.08] : [1, 1, 1],
      0.25,
      delta
    );
  });

  return (
    <Float
      floatIntensity={0.24}
      rotationIntensity={0.16}
      speed={hovered ? 1.6 : 1.1}
    >
      <group
        ref={groupRef}
        onPointerOver={onOver}
        onPointerOut={onOut}
        {...props}
      >
        <RoundedBox args={[1.75, 2.45, 0.16]} radius={0.5} smoothness={6}>
          <meshStandardMaterial
            color="#020617"
            metalness={0.3}
            roughness={0.35}
          />
        </RoundedBox>

        {/* Front */}
        <Image
          url={url}
          scale={[iconScale, iconScale, 1]}
          position={[0, 0, 0.14]}
          transparent
          toneMapped={false}
        />

        {/* Back */}
        <Image
          url={url}
          scale={[iconScale, iconScale, 1]}
          position={[0, 0, -0.14]}
          rotation={[0, Math.PI, 0]}
          transparent
          toneMapped={false}
        />
      </group>
    </Float>
  );
});

/* -----------------------------------------------
    🔥 Banner (Scrolling cylinder with shine)
------------------------------------------------*/
const Banner = memo(function Banner(props) {
  const ref = useRef();
  const scroll = useScroll();

  const texture = useTexture("/skills/logo fr.png");

  // Configure texture once
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  }, [texture]);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh || !mesh.material) return;

    mesh.material.time.value += Math.abs(scroll.delta) * 3.0;
    mesh.material.map.offset.x += delta / 2.8;
  });

  const RING_RADIUS = 3.0;

  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry
        args={[RING_RADIUS, RING_RADIUS, 0.24, 96, 12, true]}
      />

      <meshSineMaterial
        map={texture}
        map-repeat={[12, 1]}
        map-anisotropy={16}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
});

export default ScrollAnimation;
