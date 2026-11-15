import { useThree } from "@react-three/fiber";
import { noise2D } from "@remotion/noise";
import { useLayoutEffect } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import * as THREE from "three";

type Vec3 = [number, number, number];

/**
 * Tipos de movimento de câmera:
 * - dolly:    câmera anda para frente/trás em direção ao alvo
 * - orbita:   gira em volta do alvo (arco)
 * - grua:     sobe/desce enquanto mira o alvo (crane / jib)
 * - travelling: desloca lateralmente (truck / tracking)
 * - dollyZoom: efeito "Vertigo" — anda para trás e fecha o zoom (FOV) ao mesmo tempo
 * - caminho:  segue uma curva suave por vários pontos (drone / fly-through)
 */
export type Tomada =
  | { tipo: "dolly"; duracao: number; de: Vec3; para: Vec3; alvo?: Vec3; fov?: number }
  | { tipo: "orbita"; duracao: number; raio: number; altura: number; anguloDe: number; anguloPara: number; alvo?: Vec3; fov?: number }
  | { tipo: "grua"; duracao: number; de: Vec3; para: Vec3; alvo?: Vec3; fov?: number }
  | { tipo: "travelling"; duracao: number; de: Vec3; para: Vec3; alvo?: Vec3; fov?: number }
  | { tipo: "dollyZoom"; duracao: number; distDe: number; distPara: number; alvo?: Vec3; larguraEnquadrada?: number }
  | { tipo: "caminho"; duracao: number; pontos: Vec3[]; alvo?: Vec3; fov?: number };

export type OpcoesRig = {
  /** Intensidade do tremor de câmera na mão (0 = tripé). Ex.: 0.03 */
  tremor?: number;
  /** Inclinação holandesa (dutch angle), em radianos */
  dutch?: number;
};

const easing = Easing.bezier(0.45, 0, 0.2, 1); // ease-in-out "cinematográfico"

export const duracaoTotal = (tomadas: Tomada[]) => tomadas.reduce((s, t) => s + t.duracao, 0);

/** Encontra a tomada ativa no frame e o progresso (0..1) dentro dela. */
const tomadaAtual = (tomadas: Tomada[], frame: number) => {
  let inicio = 0;
  for (const t of tomadas) {
    if (frame < inicio + t.duracao) return { t, p: (frame - inicio) / Math.max(1, t.duracao - 1) };
    inicio += t.duracao;
  }
  return { t: tomadas[tomadas.length - 1], p: 1 };
};

const lerp3 = (a: Vec3, b: Vec3, p: number): Vec3 => [
  a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p,
];

export const CameraRig: React.FC<{ tomadas: Tomada[] } & OpcoesRig> = ({ tomadas, tremor = 0, dutch = 0 }) => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  useLayoutEffect(() => {
    const { t, p: pBruto } = tomadaAtual(tomadas, frame);
    const p = easing(Math.min(1, Math.max(0, pBruto)));
    const alvo = new THREE.Vector3(...(t.alvo ?? [0, 0, 0]));
    let pos: Vec3 = [0, 0, 10];
    let fov = "fov" in t && t.fov ? t.fov : 40;

    switch (t.tipo) {
      case "dolly":
      case "grua":
      case "travelling":
        pos = lerp3(t.de, t.para, p);
        break;
      case "orbita": {
        const a = interpolate(p, [0, 1], [t.anguloDe, t.anguloPara]);
        pos = [alvo.x + Math.sin(a) * t.raio, alvo.y + t.altura, alvo.z + Math.cos(a) * t.raio];
        break;
      }
      case "dollyZoom": {
        const dist = interpolate(p, [0, 1], [t.distDe, t.distPara]);
        const largura = t.larguraEnquadrada ?? 3;
        // mantém o sujeito do mesmo tamanho enquanto o fundo "estica"
        fov = THREE.MathUtils.radToDeg(2 * Math.atan(largura / 2 / dist));
        pos = [alvo.x, alvo.y + 0.3, alvo.z + dist];
        break;
      }
      case "caminho": {
        const curva = new THREE.CatmullRomCurve3(t.pontos.map((v) => new THREE.Vector3(...v)));
        const v = curva.getPointAt(p);
        pos = [v.x, v.y, v.z];
        break;
      }
    }

    // Tremor de câmera na mão (determinístico, baseado em ruído e no frame)
    const sx = noise2D("x", frame * 0.02, 0) * tremor;
    const sy = noise2D("y", frame * 0.02, 0) * tremor;

    camera.position.set(pos[0] + sx, pos[1] + sy, pos[2]);
    camera.fov = fov;
    camera.updateProjectionMatrix();
    camera.lookAt(alvo.x + sx * 0.5, alvo.y + sy * 0.5, alvo.z);
    camera.rotateZ(dutch + noise2D("r", frame * 0.015, 0) * tremor * 0.3);
  }, [frame, tomadas, tremor, dutch, camera]);

  return null;
};
