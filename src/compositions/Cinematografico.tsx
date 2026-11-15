import { ThreeCanvas } from "@remotion/three";
import { Environment, Lightformer, MeshReflectorMaterial, Sparkles } from "@react-three/drei";
import { Bloom, DepthOfField, EffectComposer, Vignette } from "@react-three/postprocessing";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import "../fonts";
import { FONTE } from "../fonts";
import { CameraRig, duracaoTotal, type Tomada } from "../components/CameraRig";

// Roteiro de câmera: edite/reordene as tomadas para criar outro filme.
export const TOMADAS: Tomada[] = [
  { tipo: "caminho", duracao: 120, pontos: [[-14, 6, 18], [-6, 3, 12], [0, 1.6, 9], [4, 1.2, 6]], alvo: [0, 1, 0], fov: 35 }, // drone de abertura
  { tipo: "orbita", duracao: 120, raio: 6, altura: 1.2, anguloDe: 0.6, anguloPara: -1.2, alvo: [0, 1.2, 0], fov: 30 },
  { tipo: "grua", duracao: 90, de: [0, 0.3, 5], para: [0, 6, 7], alvo: [0, 1.2, 0], fov: 40 },
  { tipo: "travelling", duracao: 90, de: [-7, 1, 4], para: [7, 1, 4], alvo: [0, 1.2, 0], fov: 28 },
  { tipo: "dollyZoom", duracao: 120, distDe: 4, distPara: 14, alvo: [0, 1.2, 0], larguraEnquadrada: 3.2 },
  { tipo: "dolly", duracao: 90, de: [0, 1.4, 12], para: [0, 1.3, 3.2], alvo: [0, 1.3, 0], fov: 35 },
];
export const DURACAO_CINEMATOGRAFICO = duracaoTotal(TOMADAS);

const Cenario: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <color attach="background" args={["#05060a"]} />
      <fog attach="fog" args={["#05060a", 10, 35]} />
      <ambientLight intensity={0.15} />
      <spotLight position={[0, 10, 2]} angle={0.4} penumbra={1} intensity={300} castShadow />
      <pointLight position={[-4, 2, -3]} intensity={40} color="#06b6d4" />
      <pointLight position={[4, 2, -3]} intensity={40} color="#a855f7" />
      <Environment resolution={256}>
        <Lightformer intensity={3} position={[0, 5, -6]} scale={[10, 2, 1]} />
        <Lightformer intensity={1.5} color="#a855f7" position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
      </Environment>

      {/* Objeto herói */}
      <group position={[0, 1.2, 0]} rotation={[frame * 0.004, frame * 0.012, 0]}>
        <mesh castShadow>
          <torusKnotGeometry args={[0.8, 0.28, 256, 48]} />
          <meshPhysicalMaterial color="#c4b5fd" metalness={1} roughness={0.12} clearcoat={1} />
        </mesh>
      </group>

      {/* Pilares em volta */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 5, 2, Math.sin(a) * 5]} castShadow>
            <boxGeometry args={[0.3, 4, 0.3]} />
            <meshStandardMaterial color="#111827" emissive={i % 2 ? "#06b6d4" : "#a855f7"} emissiveIntensity={0.25} />
          </mesh>
        );
      })}

      {/* Chão espelhado */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <MeshReflectorMaterial
          resolution={1024} mirror={0.6} mixBlur={1} blur={[300, 80]} mixStrength={2}
          roughness={0.8} depthScale={1} color="#0a0a12" metalness={0.5}
        />
      </mesh>

      <Sparkles count={120} scale={[14, 6, 14]} position={[0, 3, 0]} size={2} speed={0} color="#e9d5ff" />
    </>
  );
};

/** Tarjas pretas de cinema (2.39:1) + fade de entrada/saída */
const Moldura: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const barra = (height - width / 2.39) / 2;
  const fade = interpolate(frame, [0, 20, durationInFrames - 20, durationInFrames - 1], [1, 0, 0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: barra, background: "black" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: barra, background: "black" }} />
      <AbsoluteFill style={{ background: "black", opacity: fade }} />
    </AbsoluteFill>
  );
};

const Titulo: React.FC<{ texto: string; sub: string }> = ({ texto, sub }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 20, 70, 90], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const ls = interpolate(frame, [0, 90], [30, 12]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: o, fontFamily: FONTE }}>
      <div style={{ color: "white", fontSize: 96, fontWeight: 900, letterSpacing: ls }}>{texto}</div>
      <div style={{ color: "#c4b5fd", fontSize: 32, letterSpacing: 10, marginTop: 12 }}>{sub}</div>
    </AbsoluteFill>
  );
};

export const Cinematografico: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ position: [0, 2, 10], fov: 40, near: 0.1, far: 100 }}>
        <CameraRig tomadas={TOMADAS} tremor={0.02} />
        <Cenario />
        <EffectComposer multisampling={0}>
          <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={3} />
          <Bloom intensity={0.9} luminanceThreshold={0.6} mipmapBlur />
          <Vignette eskil={false} offset={0.2} darkness={0.8} />
        </EffectComposer>
      </ThreeCanvas>
      <Sequence from={30} durationInFrames={90}>
        <Titulo texto="CINEMATIC" sub="REMOTION × THREE.JS" />
      </Sequence>
      <Moldura />
    </AbsoluteFill>
  );
};
