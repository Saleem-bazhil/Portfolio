// src/components/BackendAnimation.jsx
import * as THREE from "three";
import { useRef, useState, useMemo } from "react";
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

// BACKEND SKILLS – change to backend icons when ready
const SKILLS = [
  { url: "/skills/html.png", scale: 1.6 },
  { url: "/skills/css.jpeg", scale: 1.6 },
  { url: "/skills/js.jpeg", scale: 1.55 },
  { url: "/skills/react.png", scale: 1.65 },
  { url: "/skills/python.png", scale: 1.6 },
  { url: "/skills/django.png", scale: 1.6 },
];

const CAMERA_Z = 21.5;

// 👈 how far left the ring sits. More negative = further left.
const RING_X = -4.6;

const BackendAnimation = () => (
  <Canvas
    className="w-full h-full"
    camera={{ position: [0, 0, CAMERA_Z], fov: 26 }}
    gl={{ alpha: true, antialias: true }}
  >
    <ambientLight intensity={0.8} color="#00f0aa" />
    <directionalLight position={[6, 10, 8]} intensity={1.1} color="#00e1ff" />
    <pointLight position={[-4, -2, 6]} intensity={0.45} color="#00d9aa" />
    <directionalLight position={[8, 4, 4]} intensity={0.4} color="#38bdf8" />

    <fog attach="fog" args={["#04130f", 20, 55]} />

    <ScrollControls pages={4} infinite>
      {/* moved further left using RING_X */}
      <Rig position={[RING_X, -0.25, 0]}>
        <Carousel />
      </Rig>

      <Banner position={[RING_X, -0.08, 0]} />
    </ScrollControls>
  </Canvas>
);

function Rig({ children, position }) {
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
    ref.current.rotation.x = BASE_TILT_X;
    ref.current.rotation.y =
      BASE_Y_OFFSET + autoRotation.current + scrollRotation;
    ref.current.rotation.z = BASE_TILT_Z;

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
}

function Carousel({ radius = 3.2 }) {
  const count = SKILLS.length;

  return (
    <group>
      {SKILLS.map((skill, i) => {
        const angle = (i / count) * Math.PI * 2;

        return (
          <Card
            key={skill.url ?? i}
            url={skill.url}
            iconScale={skill.scale}
            position={[
              Math.sin(angle) * radius,
              0.23,
              Math.cos(angle) * radius,
            ]}
            rotation={[0, Math.PI + angle, 0]}
          />
        );
      })}
    </group>
  );
}

function Card({ url, iconScale, ...props }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    easing.damp3(
      groupRef.current.scale,
      hovered ? [1.08, 1.08, 1.08] : [1, 1, 1],
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
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <RoundedBox args={[1.65, 2.3, 0.16]} radius={0.48} smoothness={6}>
          <meshStandardMaterial
            color="#020e0b"
            metalness={0.35}
            roughness={0.38}
          />
        </RoundedBox>

        <Image
          url={url}
          scale={[iconScale, iconScale, 1]}
          position={[0, 0, 0.14]}
          transparent
          side={THREE.FrontSide}
        />

        <Image
          url={url}
          scale={[iconScale, iconScale, 1]}
          position={[0, 0, -0.14]}
          rotation={[0, Math.PI, 0]}
          transparent
          side={THREE.FrontSide}
        />
      </group>
    </Float>
  );
}

function Banner(props) {
  const ref = useRef();
  const scroll = useScroll();

  const texture = useTexture("/skills/logo fr.png");

  useMemo(() => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  }, [texture]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.material.time.value += Math.abs(scroll.delta) * 3.0;
    ref.current.material.map.offset.x += delta / 2.7;
  });

  const RADIUS = 2.9;

  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[RADIUS, RADIUS, 0.22, 96, 12, true]} />
      <meshSineMaterial
        map={texture}
        map-repeat={[11, 1]}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default BackendAnimation;
