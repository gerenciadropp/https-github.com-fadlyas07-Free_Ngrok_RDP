import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Identidade AivaTech (brand guidelines)
export const COR = {
  verde: "#00C875",
  verdeEscuro: "#00855A",
  noite: "#0B0F0E",
  surface: "#161D1A",
  surface2: "#1E2722",
  texto: "#E8F0EB",
  textoSec: "#7A9085",
  borda: "rgba(255,255,255,0.07)",
  erro: "#C0392B",
};
export const GRADIENTE = "linear-gradient(135deg, #00C875, #00855A)";
export const TITULO = "Syne";
export const CORPO = "DM Sans";

for (const w of ["700", "800"]) {
  loadFont({ family: TITULO, url: staticFile(`fonts/syne-latin-${w}-normal.woff2`), weight: w });
}
for (const w of ["300", "400", "500"]) {
  loadFont({ family: CORPO, url: staticFile(`fonts/dm-sans-latin-${w}-normal.woff2`), weight: w });
}
