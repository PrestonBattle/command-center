export function Background() {
  return (
    <div 
      className="fixed inset-0 overflow-hidden -z-10 pointer-events-none"
      style={{
        background: "linear-gradient(287deg, rgba(224,223,242,1) 9%, rgba(140,138,184,1) 75%, rgba(224,223,242,1) 100%)",
        backgroundSize: "300% 300%",
        animation: "rotate 20s alternate infinite",
      }}
    >
      {/* <div className="[clip-path:polygon(0_0,100%_0,100%_80%,20%_40%,0_80%)] bg-(--mantine-color-purple-7) h-96"></div>
      <div id="background-shape-1" className="w-9/12 h-10/12 bottom-6/12 right-6/12 bg-(--mantine-color-purple-7) rounded-full absolute opacity-30"></div> */}
      <div className="absolute inset-0 backdrop-blur-xl"></div>
    </div>
  )
}