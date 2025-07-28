import React, { useRef } from "react";

export default function TiltCard({ children }) {
  const cardRef = useRef();

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = ((y - height / 2) / height) * -20; // Invert to match intuitive tilt
    const rotateY = ((x - width / 2) / width) * 20;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const resetTilt = () => {
    const card = cardRef.current;
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <div
      className="perspective-wrapper"
      style={{
        perspective: "1000px",
        display: "inline-block",
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        className="transition-transform duration-300 will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}