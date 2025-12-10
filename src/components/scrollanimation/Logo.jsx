// src/components/Logo.jsx
import { memo } from "react";
import profileImg from "../../assets/profile (4).png";

function LogoComponent({ className = "", style, ...props }) {
  return (
    <img
      src={profileImg}
      alt="User logo"
      className={`rounded-full object-cover ${className}`}
      style={{
        boxShadow: "0 18px 45px rgba(56, 189, 248, 0.35)",
        ...style,
      }}
      {...props}
    />
  );
}

const Logo = memo(LogoComponent);
export default Logo;
