export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#fff3ec]"
    >
      <div className="absolute -left-40 -top-52 size-[760px] rounded-full bg-[#fdba74] opacity-85 blur-[110px]" />
      <div className="absolute -top-28 left-[68%] size-[560px] rounded-full bg-[#f9a8d4] opacity-70 blur-[110px]" />
      <div className="absolute left-[45%] top-[45%] size-[820px] rounded-full bg-[#fb923c] opacity-55 blur-[110px]" />
      <div className="absolute -left-16 top-[60%] size-[480px] rounded-full bg-[#fecaca] opacity-90 blur-[110px]" />
      <div className="absolute left-[78%] top-[62%] size-[420px] rounded-full bg-[#fde68a] opacity-80 blur-[110px]" />

      {/* soft diagonal shine */}
      <div className="absolute inset-0 bg-[linear-gradient(125deg,rgb(255_255_255/0.5)_0%,transparent_35%,transparent_65%,rgb(255_255_255/0.3)_100%)]" />
    </div>
  );
}