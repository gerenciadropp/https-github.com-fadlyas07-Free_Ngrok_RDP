# Vídeos 3D, cinematográficos e anúncios — Remotion + Three.js

Projeto pronto para criar vídeos em código (React): animações 3D, filmes com vários
movimentos de câmera, anúncios com legendas animadas e áudio, renderizados em MP4.

## Requisitos
- Node.js 18+ (testado com 22), npm, git
- ffmpeg (opcional — o Remotion já traz o seu próprio para renderizar)

## Começando
```bash
npm install
npm run dev          # abre o Remotion Studio no navegador (preview ao vivo, edição de props)
```

## Renderizar
```bash
npm run render:ad    # anúncio vertical 9:16 (Reels/TikTok/Stories) → out/anuncio-vertical.mp4
npm run render:3d    # cena 3D 16:9 → out/cena-3d.mp4
npm run render:cine  # filme cinematográfico 16:9 → out/cinematografico.mp4
npm run render:all   # todos
```
Trocar textos/cores do anúncio sem mexer no código:
```bash
npx remotion render AnuncioVertical out/promo.mp4 --props='{"produto":"Café X","slogan":"Energia pura","cta":"Peça já","corPrimaria":"#b45309","corSecundaria":"#facc15"}'
```
GPU: no Linux o padrão é `swangle` (software, funciona em qualquer servidor, mais lento).
Com GPU use `REMOTION_GL=angle` (Mac/Windows já usam por padrão) ou `REMOTION_GL=vulkan`.

## Composições
| ID | Formato | O que mostra |
|---|---|---|
| `AnuncioVertical` | 1080×1920, 12s | Produto 3D, título animado, legendas estilo TikTok, música com fade, CTA |
| `Cena3D` | 1920×1080, 8s | Cena Three.js simples |
| `Cinematografico` | 1920×1080, ~21s | 6 tomadas de câmera, chão espelhado, bloom, profundidade de campo, vinheta, tarjas 2.39:1 |

## Movimentos de câmera (`src/components/CameraRig.tsx`)
Monte o roteiro como uma lista de tomadas (veja `TOMADAS` em `src/compositions/Cinematografico.tsx`):

| tipo | movimento |
|---|---|
| `dolly` | aproxima/afasta do alvo (push-in / pull-out) |
| `orbita` | arco em volta do alvo |
| `grua` | sobe/desce mirando o alvo (crane/jib) |
| `travelling` | desliza lateralmente (truck/tracking) |
| `dollyZoom` | efeito Vertigo: anda para trás e fecha o zoom ao mesmo tempo |
| `caminho` | voo suave por vários pontos (drone / fly-through) |

Opções do rig: `tremor` (câmera na mão) e `dutch` (inclinação). Todas as animações usam
`useCurrentFrame()` — nunca `useFrame`/relógio do Three — para o render ser determinístico.

## Legendas e áudio
- Legendas: `public/legendas.json` no formato `Caption` do `@remotion/captions`
  (`text`, `startMs`, `endMs`). Para gerar automaticamente a partir de uma narração,
  use `@remotion/install-whisper-cpp` (já instalado) — transcreve com timestamps por palavra.
- Áudio: coloque arquivos em `public/` e use `<Audio src={staticFile("arquivo.mp3")} />`.
  `public/musica.wav` é só um tom de exemplo gerado com ffmpeg — troque por sua trilha.
- Fontes: `public/fonts` (Inter embutida; funciona offline).

## Pacotes instalados
- Vídeo: `remotion`, `@remotion/cli`, `@remotion/renderer`, `@remotion/bundler`, `@remotion/media`, `@remotion/media-utils`, `@remotion/transitions`, `@remotion/motion-blur`, `@remotion/paths`, `@remotion/noise`, `@remotion/layout-utils`
- 3D: `three`, `@remotion/three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`, `maath`
- Legendas/texto: `@remotion/captions`, `@remotion/install-whisper-cpp`, `@remotion/fonts`, `@remotion/google-fonts`, `@fontsource/inter`
- Props tipadas: `zod`, `@remotion/zod-types`

> Licença do Remotion: grátis para pessoas físicas e empresas de até 3 funcionários;
> empresas maiores precisam de licença (https://remotion.dev/license).
