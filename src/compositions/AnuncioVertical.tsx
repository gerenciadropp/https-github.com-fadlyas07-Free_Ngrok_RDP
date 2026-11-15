import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import {
  AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import "../fonts";
import type { Caption } from "@remotion/captions";
import { Produto3D } from "../components/Produto3D";
import { Legendas } from "../components/Legendas";
import captions from "../../public/legendas.json";

export const anuncioSchema = z.object({
  produto: z.string(),
  slogan: z.string(),
  cta: z.string(),
  corPrimaria: zColor(),
  corSecundaria: zColor(),
});

export const AnuncioVertical: React.FC<z.infer<typeof anuncioSchema>> = ({
  produto, slogan, cta, corPrimaria, corSecundaria,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const titulo = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const ctaIn = spring({ frame: frame - (durationInFrames - 90), fps });
  // Fade da música no início e no fim
  const volume = (f: number) =>
    interpolate(f, [0, 20, durationInFrames - 30, durationInFrames], [0, 0.5, 0.5, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${corPrimaria}66, #0b0b14 70%)`,
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <Audio src={staticFile("musica.wav")} volume={volume} />

      <Produto3D cor={corPrimaria} corSecundaria={corSecundaria} width={width} height={height} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 220 }}>
        <div
          style={{
            fontSize: 120, fontWeight: 900, color: "white",
            transform: `translateY(${interpolate(titulo, [0, 1], [-80, 0])}px)`, opacity: titulo,
          }}
        >
          {produto}
        </div>
        <div style={{ fontSize: 52, color: "#e5e7eb", marginTop: 16, opacity: titulo }}>{slogan}</div>
      </AbsoluteFill>

      <Legendas captions={captions as Caption[]} corDestaque={corSecundaria} />

      <Sequence from={durationInFrames - 90}>
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 160 }}>
          <div
            style={{
              background: corSecundaria, color: "#0b0b14", fontSize: 64, fontWeight: 900,
              padding: "28px 72px", borderRadius: 999, transform: `scale(${ctaIn})`,
            }}
          >
            {cta}
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
