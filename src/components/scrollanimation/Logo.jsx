import profileImg from "../../assets/profile (4).png";

export default function Logo({ className = "", style, ...props }) {
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
