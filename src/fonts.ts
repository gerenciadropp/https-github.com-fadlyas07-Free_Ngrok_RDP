import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fontes embutidas em public/fonts: funcionam offline e sem depender do Google Fonts.
export const FONTE = "Inter";
for (const weight of ["400", "700", "900"]) {
  loadFont({ family: FONTE, url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight });
}
