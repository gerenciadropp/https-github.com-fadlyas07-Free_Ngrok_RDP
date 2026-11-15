import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setCodec("h264");
// WebGL (necessário para Three.js) no Chrome headless:
// - "swangle": renderiza por software, funciona em servidor/Linux sem GPU (padrão no Linux)
// - "angle":   usa a GPU (padrão no Mac/Windows) — bem mais rápido
// - "vulkan" / "egl": GPU no Linux
// Troque com a variável de ambiente REMOTION_GL, ex.: REMOTION_GL=angle npm run render:cine
type GL = "swangle" | "angle" | "egl" | "swiftshader" | "vulkan" | "angle-egl";
Config.setChromiumOpenGlRenderer(
  (process.env.REMOTION_GL as GL | undefined) ?? (process.platform === "linux" ? "swangle" : "angle"),
);
Config.setConcurrency(null);

// Usa um Chrome headless já instalado, se existir (ex.: ambiente cloud sem acesso
// ao download do Remotion). Defina REMOTION_BROWSER para apontar outro binário.
import fs from "node:fs";
const navegadorLocal =
  process.env.REMOTION_BROWSER ??
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (fs.existsSync(navegadorLocal)) {
  Config.setBrowserExecutable(navegadorLocal);
}
