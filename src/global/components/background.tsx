export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg-base)]"
    >
      <div className="absolute -left-40 -top-52 size-[760px] rounded-full bg-[var(--bg-top-left)] opacity-85 blur-[110px]" />
      <div className="absolute -top-28 left-[68%] size-[560px] rounded-full bg-[var(--bg-top-right)] opacity-70 blur-[110px]" />
      <div className="absolute left-[45%] top-[45%] size-[820px] rounded-full bg-[var(--bg-center)] opacity-55 blur-[110px]" />
      <div className="absolute -left-16 top-[60%] size-[480px] rounded-full bg-[var(--bg-bottom-left)] opacity-90 blur-[110px]" />
      <div className="absolute left-[78%] top-[62%] size-[420px] rounded-full bg-[var(--bg-bottom-right)] opacity-80 blur-[110px]" />

      {/* soft diagonal shine */}
      <div className="absolute inset-0 bg-[linear-gradient(125deg,var(--bg-shine)_0%,transparent_35%,transparent_65%,var(--bg-shine-soft)_100%)]" />
    </div>
  );
}