// src/components/ScrollAnimation.jsx
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
import "./util";

// Slightly smaller icons so the ring isn't in your face
const SKILLS = [
  { url: "/skills/html.png", scale: 1.6 },
  { url: "/skills/css.jpeg", scale: 1.6 },
  { url: "/skills/js.jpeg", scale: 1.55 },
  { url: "/skills/react.png", scale: 1.65 },
  { url: "/skills/python.png", scale: 1.6 },
  { url: "/skills/django.png", scale: 1.6 },
];

// Camera farther back → full ring visible and not cropped
const CAMERA_Z = 20.5;

const ScrollAnimation = () => (
  
  <Canvas
    className="w-full h-full"                      // make it fill the parent
    camera={{ position: [0, 0, CAMERA_Z], fov: 26 }}
    gl={{ alpha: true, antialias: true }}          // transparent WebGL
  >

    {/* Softer, more cinematic lighting */}
    <ambientLight intensity={0.7} />
    <directionalLight position={[6, 10, 8]} intensity={1.3}  />
    <pointLight position={[-4, -2, 6]} intensity={0.4} />

    <fog attach="fog" args={["#0b0e14", 20, 50]} />

    <ScrollControls pages={4} infinite>
      {/* Move a little right + a little down to match your layout */}
      <Rig position={[3.7, -0.5, 0]}>
        <Carousel />
      </Rig>

      {/* Band cutting through lower part of cards */}
      <Banner position={[3.7, -0.35, 0]} />
    </ScrollControls>
  </Canvas>
);

/* 🔄 AUTO-ROTATE + SCROLL-ROTATE + REFINED TILT */
function Rig({ children, position }) {
  const ref = useRef();
  const scroll = useScroll();
  const autoRotation = useRef(0);

  // base tilt so direction is always nice
  const BASE_TILT_X = -0.32; // gentle backward tilt
  const BASE_TILT_Z = -0.08; // slight lean
  const BASE_Y_OFFSET = Math.PI / 7; // ~25° towards camera

  useFrame((state, delta) => {
    if (!ref.current) return;

    // slower, smoother auto-spin
    autoRotation.current += delta * 0.14;

    const scrollRotation = -scroll.offset * (Math.PI * 2);
    const rotY = BASE_Y_OFFSET + autoRotation.current + scrollRotation;

    ref.current.rotation.x = BASE_TILT_X;
    ref.current.rotation.y = rotY;
    ref.current.rotation.z = BASE_TILT_Z;

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
}

// Wider radius → full circle around center, no cropping
function Carousel({ radius = 3.45  }) {
  const count = SKILLS.length;

  return (
    <group>
      {SKILLS.map((skill, i) => {
        const angle = (i / count) * Math.PI * 2;
        return (
          <Card
            key={i}
            url={skill.url}
            iconScale={skill.scale}
            position={[
              Math.sin(angle) * radius,
              0.25, // raise so band hits lower third
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

  const pointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
  };
  const pointerOut = () => setHovered(false);

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
  floatIntensity={0.24}        // was 0.28
  rotationIntensity={0.16}     // was 0.18
  speed={hovered ? 1.6 : 1.1}  // was 2.0 / 1.2
>

      <group
        ref={groupRef}
        onPointerOver={pointerOver}
        onPointerOut={pointerOut}
        {...props}
      >
        {/* Slightly smaller card so everything fits on screen */}
        <RoundedBox
          args={[1.75, 2.45, 0.16]} // width, height, depth
          radius={0.5}
          smoothness={6}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color="#020617"
            metalness={0.3}
            roughness={0.35}
          />
        </RoundedBox>

        <Image
          url={url}
          scale={[iconScale, iconScale, 1]}
          position={[0, 0, 0.14]}
          transparent
          side={THREE.FrontSide}
          toneMapped={false}
        />
        <Image
          url={url}
          scale={[iconScale, iconScale, 1]}
          position={[0, 0, -0.14]}
          rotation={[0, Math.PI, 0]}
          transparent
          side={THREE.FrontSide}
          toneMapped={false}
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
    ref.current.material.map.offset.x += delta / 2.8;
  });

  // Slightly smaller than cards radius so it cuts through the inside
  const RING_RADIUS = 3.0;

  return (
    <mesh ref={ref} rotation={[0, 0, 0]} {...props}>
      <cylinderGeometry args={[RING_RADIUS, RING_RADIUS, 0.24, 96, 12, true]} />
      <meshSineMaterial
        map={texture}
        map-anisotropy={16}
        map-repeat={[12, 1]}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

export default ScrollAnimation;
