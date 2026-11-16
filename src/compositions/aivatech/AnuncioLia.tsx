import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { COR, CORPO, GRADIENTE, TITULO } from "./marca";

const T = 12; // frames de transição

/* ---------- elementos comuns ---------- */

const Fundo: React.FC<{ brilho?: number }> = ({ brilho = 0.35 }) => (
  <AbsoluteFill style={{ background: COR.noite }}>
    {/* orbe de luz verde (padrão visual AivaTech) */}
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 38%, rgba(0,200,117,${brilho}) 0%, rgba(0,200,117,0) 55%)`,
        filter: "blur(20px)",
      }}
    />
  </AbsoluteFill>
);

const entrada = (frame: number, fps: number, atraso = 0) =>
  spring({ frame: frame - atraso, fps, config: { damping: 16, mass: 0.8 } });

/* ---------- Cena 1: gancho (0–3s) ---------- */

const PAPEIS = [
  { x: -330, y: -420, r: -18, t: "Mercado R$ 213" },
  { x: 260, y: -360, r: 14, t: "Gasolina R$ 80" },
  { x: -280, y: 330, r: 10, t: "Luz R$ 162" },
  { x: 300, y: 420, r: -12, t: "Material R$ 95" },
  { x: -20, y: -560, r: 6, t: "Pix cliente ?" },
  { x: 40, y: 600, r: -5, t: "Nota ???" },
];

const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = entrada(frame, fps, 4);
  return (
    <AbsoluteFill>
      <Fundo brilho={0.12} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {PAPEIS.map((p, i) => {
          const s = entrada(frame, fps, i * 3);
          const balanco = Math.sin((frame + i * 9) / 10) * 3;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                transform: `translate(${p.x}px, ${p.y + (1 - s) * -900}px) rotate(${p.r + balanco}deg)`,
                background: "#F4F1E8",
                color: "#3a3a3a",
                fontFamily: CORPO,
                fontSize: 34,
                padding: "26px 30px",
                width: 300,
                borderRadius: 6,
                boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
                opacity: 0.92,
              }}
            >
              <div style={{ borderBottom: "2px dashed #bbb", paddingBottom: 10, marginBottom: 10, fontSize: 24, color: "#999" }}>
                RECIBO
              </div>
              {p.t}
            </div>
          );
        })}
        <div
          style={{
            fontFamily: TITULO, fontWeight: 800, color: "white", fontSize: 104, lineHeight: 1.05,
            textAlign: "center", maxWidth: 900, transform: `scale(${0.85 + t * 0.15})`, opacity: t,
            textShadow: "0 8px 40px rgba(0,0,0,0.9)",
          }}
        >
          Ainda anota gasto <span style={{ color: COR.verde }}>no papel?</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Cena 2: dor (3–7s) ---------- */

const Dor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = entrada(frame, fps, 0);
  const b = entrada(frame, fps, 25);
  const tremor = Math.sin(frame * 1.7) * interpolate(frame, [25, 60, 110], [0, 10, 4], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill>
      <Fundo brilho={0.08} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 60, flexDirection: "column" }}>
        <div style={{ fontFamily: CORPO, fontWeight: 400, color: COR.textoSec, fontSize: 58, opacity: a, transform: `translateY(${(1 - a) * 40}px)` }}>
          No fim do mês…
        </div>
        <div style={{ fontFamily: TITULO, fontWeight: 800, color: "white", fontSize: 92, textAlign: "center", maxWidth: 920, opacity: a }}>
          quanto você ganhou de verdade?
        </div>
        <div
          style={{
            fontFamily: TITULO, fontWeight: 800, fontSize: 190, color: COR.erro, opacity: b,
            transform: `translateX(${tremor}px) scale(${0.6 + b * 0.4})`,
          }}
        >
          R$ ???
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Cena 3: solução — conversa no WhatsApp (7–12s) ---------- */

type Msg = { de: "eu" | "lia"; texto: string; quando: number };
const CONVERSA: Msg[] = [
  { de: "eu", texto: "Gastei 80 de gasolina", quando: 8 },
  { de: "lia", texto: "Anotado ✅\nCombustível: R$ 80,00", quando: 38 },
  { de: "eu", texto: "Quanto lucrei esse mês?", quando: 70 },
  { de: "lia", texto: "Você faturou R$ 6.300\ne lucrou R$ 5.060 📊", quando: 100 },
];

const Digitando: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{ display: "flex", gap: 10, padding: "26px 30px", background: "#202C33", borderRadius: 28, alignSelf: "flex-start" }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: "#8696A0", opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame + i * 6) / 6)) }} />
    ))}
  </div>
);

const Bolha: React.FC<{ m: Msg }> = ({ m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = entrada(frame, fps, m.quando);
  const eu = m.de === "eu";
  return (
    <div
      style={{
        alignSelf: eu ? "flex-end" : "flex-start",
        maxWidth: "80%",
        background: eu ? "#005C4B" : "#202C33",
        color: "#E9EDEF",
        fontFamily: CORPO,
        fontSize: 40,
        lineHeight: 1.3,
        padding: "22px 28px",
        borderRadius: 28,
        borderTopRightRadius: eu ? 6 : 28,
        borderTopLeftRadius: eu ? 28 : 6,
        whiteSpace: "pre-line",
        transform: `scale(${s}) translateY(${(1 - s) * 30}px)`,
        transformOrigin: eu ? "right bottom" : "left bottom",
        opacity: s,
      }}
    >
      {m.texto}
    </div>
  );
};

const Solucao: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tel = entrada(frame, fps, 0);
  const visiveis = CONVERSA.filter((m) => frame >= m.quando);
  const proximaLia = CONVERSA.find((m) => m.de === "lia" && frame < m.quando && frame >= m.quando - 22);
  return (
    <AbsoluteFill>
      <Fundo brilho={0.4} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
        <div style={{ fontFamily: TITULO, fontWeight: 800, color: "white", fontSize: 76, textAlign: "center", maxWidth: 940, lineHeight: 1.1 }}>
          Com a <span style={{ color: COR.verde }}>Lia</span>, é só mandar mensagem.
        </div>
      </AbsoluteFill>
      {/* celular */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 140 }}>
        <div
          style={{
            width: 820, height: 1240, background: "#0B141A", borderRadius: 70, border: "14px solid #1c1f1e",
            boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 2px rgba(255,255,255,0.06)",
            overflow: "hidden", display: "flex", flexDirection: "column",
            transform: `translateY(${(1 - tel) * 600}px)`,
          }}
        >
          {/* topo do chat */}
          <div style={{ background: "#202C33", padding: "48px 34px 26px", display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: GRADIENTE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>🤖</div>
            <div>
              <div style={{ fontFamily: CORPO, fontWeight: 500, color: "#E9EDEF", fontSize: 40 }}>Lia · AcessorIA</div>
              <div style={{ fontFamily: CORPO, color: COR.verde, fontSize: 28 }}>online</div>
            </div>
          </div>
          {/* mensagens */}
          <div style={{ flex: 1, padding: 30, display: "flex", flexDirection: "column", gap: 22, justifyContent: "flex-end" }}>
            {visiveis.map((m, i) => <Bolha key={i} m={m} />)}
            {proximaLia ? <Digitando frame={frame} /> : null}
          </div>
          <div style={{ background: "#202C33", margin: 20, borderRadius: 40, padding: "24px 30px", fontFamily: CORPO, color: "#8696A0", fontSize: 32 }}>
            Mensagem
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Cena 4: CTA (12–15s) ---------- */

const IconeChat: React.FC = () => (
  <svg width="120" height="120" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="56" fill={COR.verde} />
    <path d="M32 84 L38 68 A30 30 0 1 1 52 82 Z" fill="white" />
    <circle cx="48" cy="56" r="5" fill={COR.verde} />
    <circle cx="62" cy="56" r="5" fill={COR.verde} />
    <circle cx="76" cy="56" r="5" fill={COR.verde} />
  </svg>
);

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = entrada(frame, fps, 0);
  const b = entrada(frame, fps, 10);
  const c = entrada(frame, fps, 20);
  const pulso = 1 + Math.sin(frame / 5) * 0.025;
  return (
    <AbsoluteFill>
      <Fundo brilho={0.5} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 44 }}>
        <div style={{ transform: `scale(${a})` }}><IconeChat /></div>
        <div style={{ fontFamily: TITULO, fontWeight: 800, color: "white", fontSize: 108, opacity: a }}>
          Acessor<span style={{ color: COR.verde }}>IA</span>
        </div>
        <div style={{ fontFamily: CORPO, fontWeight: 400, color: COR.texto, fontSize: 52, textAlign: "center", maxWidth: 860, opacity: b, transform: `translateY(${(1 - b) * 30}px)` }}>
          Organize suas finanças no WhatsApp
        </div>
        <div
          style={{
            marginTop: 30, background: GRADIENTE, color: COR.noite, fontFamily: TITULO, fontWeight: 800,
            fontSize: 62, padding: "34px 70px", borderRadius: 999, transform: `scale(${c * pulso})`,
            boxShadow: "0 0 80px rgba(0,200,117,0.45)",
          }}
        >
          Teste 7 dias grátis
        </div>
        <div style={{ fontFamily: CORPO, color: COR.textoSec, fontSize: 40, opacity: c }}>
          Sem app. Sem cartão de crédito.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- montagem ---------- */

export const DURACAO_LIA = 90 + 120 + 150 + 90 - 3 * T + 3 * T; // 450 frames = 15s

export const AnuncioLia: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const vol = (f: number) =>
    interpolate(f, [0, 15, durationInFrames - 25, durationInFrames], [0, 0.35, 0.35, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.linear,
    });
  return (
    <AbsoluteFill style={{ background: COR.noite }}>
      <Audio src={staticFile("trilha-lia.wav")} volume={vol} />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90 + T}><Gancho /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={120 + T}><Dor /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={150 + T}><Solucao /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={90}><Cta /></TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
