import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const Esferas: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <group rotation={[0, frame * 0.02, 0]}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const y = Math.sin(frame / 15 + i) * 0.5;
        return (
          <mesh key={i} position={[Math.cos(a) * 3, y, Math.sin(a) * 3]}>
            <sphereGeometry args={[0.35, 48, 48]} />
            <meshStandardMaterial color={`hsl(${i * 30}, 80%, 60%)`} metalness={0.4} roughness={0.3} />
          </mesh>
        );
      })}
      <mesh>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color="#ffffff" wireframe />
      </mesh>
    </group>
  );
};

export const Cena3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const camZ = interpolate(frame, [0, 240], [10, 7]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#05060a" }}>
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 2, camZ], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 4, 4]} intensity={60} />
        <Esferas />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
