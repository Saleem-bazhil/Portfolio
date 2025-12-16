const SectionTransition = () => {
  return (
    <div
      aria-hidden
      className="
        relative
        h-20 sm:h-28
        overflow-hidden
        pointer-events-none
      "
    >
      {/* Beam → Space blend */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-b
          from-transparent
          via-[#020617]/25
          to-transparent
        "
      />

      {/* Shared cosmic noise */}
      <div
        className="
          absolute inset-0
          opacity-25
          bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.25),transparent_55%),
              radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.2),transparent_60%)]
        "
      />

      {/* Thin continuity seam */}
      <div
        className="
          absolute inset-x-0 bottom-0 h-px
          bg-gradient-to-r
          from-transparent
          via-cyan-400/50
          to-transparent
        "
      />
    </div>
  );
};

export default SectionTransition;
