import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";

// Legendas estilo TikTok: palavras agrupadas em "páginas", palavra atual destacada.
export const Legendas: React.FC<{ captions: Caption[]; corDestaque: string }> = ({ captions, corDestaque }) => {
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () => createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 900 }),
    [captions],
  );

  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const from = Math.round((page.startMs / 1000) * fps);
        const endMs = next ? next.startMs : page.startMs + page.durationMs;
        const dur = Math.max(1, Math.round(((endMs - page.startMs) / 1000) * fps));
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <Pagina page={page} corDestaque={corDestaque} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Pagina: React.FC<{
  page: ReturnType<typeof createTikTokStyleCaptions>["pages"][number];
  corDestaque: string;
}> = ({ page, corDestaque }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const agoraMs = page.startMs + (frame / fps) * 1000;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 380 }}>
      <div
        style={{
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: 78,
          fontWeight: 900,
          textAlign: "center",
          color: "white",
          textTransform: "uppercase",
          WebkitTextStroke: "3px black",
          paintOrder: "stroke",
          maxWidth: 900,
          lineHeight: 1.15,
          whiteSpace: "pre-wrap",
        }}
      >
        {page.tokens.map((t) => {
          const ativo = t.fromMs <= agoraMs && t.toMs > agoraMs;
          return (
            <span key={t.fromMs} style={{ color: ativo ? corDestaque : "white" }}>
              {t.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
