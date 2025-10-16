import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const WinterSnow = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const numFlakes = 100; 
    const flakes = [];
    const container = containerRef.current;

    for (let i = 0; i < numFlakes; i++) {
      const flake = document.createElement("div");
      flake.classList.add("snowflake");

      const size = Math.random() * 2 + 1;
      const glowSize = Math.random() * 15 + 8; 

      Object.assign(flake.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * window.innerWidth}px`,
        top: `${Math.random() * -window.innerHeight}px`,
        background: "white",
        borderRadius: "50%",
        position: "absolute",
        zIndex: 0,
        opacity: Math.random() * 0.8 + 0.2,
        pointerEvents: "none",
        boxShadow: `0 0 ${glowSize}px rgba(173, 216, 255, 0.95)`, 
        filter: "blur(1px)",
      });

      container.appendChild(flake);
      flakes.push(flake);

      // Floating/falling animation 
      gsap.to(flake, {
        y: window.innerHeight + 10,
        x: `+=${Math.random() * 100 - 50}`,
        duration: gsap.utils.random(8, 14),
        ease: "none",
        repeat: -1,
        delay: Math.random() * 10,
      });

      // Twinkle animation 
      gsap.to(flake, {
        opacity: gsap.utils.random(0.2, 1),
        duration: gsap.utils.random(1, 2),
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: Math.random() * 2,
      });
    }

    return () => flakes.forEach((flake) => flake.remove());
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 0, 
        pointerEvents: "none",
      }}
    />
  );
};

export default WinterSnow;
