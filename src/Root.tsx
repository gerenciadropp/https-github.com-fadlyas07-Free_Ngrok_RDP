import { Composition } from "remotion";
import { AnuncioLia, DURACAO_LIA } from "./compositions/aivatech/AnuncioLia";
import { Cena3D } from "./compositions/Cena3D";
import { Cinematografico, DURACAO_CINEMATOGRAFICO, cinematograficoSchema } from "./compositions/Cinematografico";
import { AnuncioVertical, anuncioSchema } from "./compositions/AnuncioVertical";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Anúncio 9:16 (Reels / TikTok / Stories) com 3D, legendas e áudio */}
      <Composition
        id="AnuncioVertical"
        component={AnuncioVertical}
        durationInFrames={30 * 12}
        fps={30}
        width={1080}
        height={1920}
        schema={anuncioSchema}
        defaultProps={{
          produto: "Seu Produto",
          slogan: "Mais rápido. Mais simples.",
          cta: "Compre agora",
          corPrimaria: "#7c3aed",
          corSecundaria: "#06b6d4",
        }}
      />
      {/* Cena 3D 16:9 (YouTube / apresentação) */}
      <Composition
        id="Cena3D"
        component={Cena3D}
        durationInFrames={30 * 8}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* AivaTech — anúncio da Lia (AcessorIA), Reels 9:16, 15s */}
      <Composition
        id="AnuncioLia"
        component={AnuncioLia}
        durationInFrames={DURACAO_LIA}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Filme cinematográfico 16:9 com vários movimentos de câmera */}
      <Composition
        id="Cinematografico"
        component={Cinematografico}
        schema={cinematograficoSchema}
        defaultProps={{ rapido: false }}
        durationInFrames={DURACAO_CINEMATOGRAFICO}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
