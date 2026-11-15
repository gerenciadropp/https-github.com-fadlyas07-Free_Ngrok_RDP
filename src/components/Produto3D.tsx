import { ThreeCanvas } from "@remotion/three";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type Props = { cor: string; corSecundaria: string; width: number; height: number };

const Objeto: React.FC<{ cor: string; corSecundaria: string }> = ({ cor, corSecundaria }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // IMPORTANTE: no Remotion, toda animação deve depender de `frame`
  // (nunca de useFrame/clock do three), para a renderização ser determinística.
  const entrada = spring({ frame, fps, config: { damping: 12 } });
  const rot = frame * 0.03;
  const flutua = Math.sin(frame / 12) * 0.15;
  const escala = interpolate(entrada, [0, 1], [0.2, 1]);

  return (
    <group position={[0, flutua, 0]} scale={escala} rotation={[0.3, rot, 0]}>
      <RoundedBox args={[1.6, 1.6, 1.6]} radius={0.2} smoothness={6}>
        <meshStandardMaterial color={cor} metalness={0.6} roughness={0.2} />
      </RoundedBox>
      <mesh rotation={[Math.PI / 2, 0, rot]}>
        <torusGeometry args={[1.6, 0.06, 32, 128]} />
        <meshStandardMaterial color={corSecundaria} emissive={corSecundaria} emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
};

export const Produto3D: React.FC<Props> = ({ cor, corSecundaria, width, height }) => {
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={2} />
      <pointLight position={[-3, -2, 2]} intensity={20} color={corSecundaria} />
      {/* Ambiente de reflexo gerado localmente (sem baixar HDRI da internet) */}
      <Environment resolution={256}>
        <Lightformer intensity={4} position={[0, 5, -5]} scale={[10, 3, 1]} />
        <Lightformer intensity={2} position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer intensity={2} color={corSecundaria} position={[5, 1, 0]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
      </Environment>
      <Objeto cor={cor} corSecundaria={corSecundaria} />
    </ThreeCanvas>
  );
};
