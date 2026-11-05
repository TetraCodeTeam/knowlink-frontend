import { useEffect, useState, type RefObject } from "react";

/*
 * Frankie "vivo": la imagen se vuelve a muestrear en cada cuadro con pequeñas deformaciones, sin capas extra.
 *   cola   = una curvatura que viaja a lo largo de ella, con pivote en el pedúnculo
 *   olas   = un brillo lateral lento sobre el agua
 *   ojo    = un parpadeo ocasional
 * Las coordenadas están en el espacio de 1000 x 783 de la imagen. Si algo falla (por ejemplo un canvas
 * contaminado) se queda la imagen estática.
 */
const IMAGE_WIDTH = 1000;
const MIN_IMAGE_HEIGHT = 700;
const FRAME_MS = 33;

const smooth = (a: number, b: number, value: number) => {
  const x = Math.min(1, Math.max(0, (value - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

export function useLivingWhale(
  imageRef: RefObject<HTMLImageElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  visibilityRef: RefObject<HTMLElement | null>
): boolean {
  const [alive, setAlive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas || !canvas.getContext) return;

    let cancelled = false;
    let frameId = 0;
    let visible = true;
    let last = 0;
    let nextBlink = 0;
    let blinkAt = -1;
    let observer: IntersectionObserver | null = null;

    async function init() {
      try {
        if (!image || !canvas) return;
        if (image.decode) await image.decode();
        if (cancelled) return;
        const W = image.naturalWidth;
        const H = image.naturalHeight;
        if (W !== IMAGE_WIDTH || H < MIN_IMAGE_HEIGHT) return;
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const off = document.createElement("canvas");
        off.width = W;
        off.height = H;
        const offCtx = off.getContext("2d", { willReadFrequently: true });
        if (!offCtx) return;
        offCtx.drawImage(image, 0, 0);
        const src = offCtx.getImageData(0, 0, W, H).data;

        // Muestreo bilineal ponderado por alfa de la imagen original hacia out[o..o+3].
        const bilinear = (out: Uint8ClampedArray, o: number, sxIn: number, syIn: number) => {
          const sx = Math.min(Math.max(sxIn, 0), W - 1.001);
          const sy = Math.min(Math.max(syIn, 0), H - 1.001);
          const x0 = sx | 0;
          const y0 = sy | 0;
          const fx = sx - x0;
          const fy = sy - y0;
          const i00 = (y0 * W + x0) * 4;
          const i10 = i00 + 4;
          const i01 = i00 + W * 4;
          const i11 = i01 + 4;
          const w00 = (1 - fx) * (1 - fy) * src[i00 + 3];
          const w10 = fx * (1 - fy) * src[i10 + 3];
          const w01 = (1 - fx) * fy * src[i01 + 3];
          const w11 = fx * fy * src[i11 + 3];
          const A = w00 + w10 + w01 + w11;
          if (A < 0.01) {
            out[o] = out[o + 1] = out[o + 2] = out[o + 3] = 0;
            return;
          }
          out[o] = (src[i00] * w00 + src[i10] * w10 + src[i01] * w01 + src[i11] * w11) / A;
          out[o + 1] =
            (src[i00 + 1] * w00 + src[i10 + 1] * w10 + src[i01 + 1] * w01 + src[i11 + 1] * w11) / A;
          out[o + 2] =
            (src[i00 + 2] * w00 + src[i10 + 2] * w10 + src[i01 + 2] * w01 + src[i11 + 2] * w11) / A;
          out[o + 3] = A;
        };
        const copyPixel = (out: Uint8ClampedArray, o: number, x: number, y: number) => {
          const i = (y * W + x) * 4;
          out[o] = src[i];
          out[o + 1] = src[i + 1];
          out[o + 2] = src[i + 2];
          out[o + 3] = src[i + 3];
        };

        // Región de la cola: x 0-400, y 0-300, con pivote en el pedúnculo.
        const TW = 400;
        const TH = 300;
        const PX = 250;
        const PY = 235;
        const AMP = 0.11;
        const tail = ctx.createImageData(TW, TH);
        const tDx = new Float32Array(TW * TH);
        const tDy = new Float32Array(TW * TH);
        const tR = new Float32Array(TW * TH);
        const tW = new Float32Array(TW * TH);
        for (let y = 0; y < TH; y++) {
          for (let x = 0; x < TW; x++) {
            const k = y * TW + x;
            const dx = x - PX;
            const dy = y - PY;
            const r = Math.sqrt(dx * dx + dy * dy);
            tDx[k] = dx;
            tDy[k] = dy;
            tR[k] = r;
            tW[k] = smooth(50, 240, r) * (1 - smooth(235, 300, y)) * (1 - smooth(330, 400, x));
          }
        }

        // Región del agua: x 250-950, y 610-783.
        const WX = 250;
        const WY = 610;
        const WW = 700;
        const WH = H - WY;
        const water = ctx.createImageData(WW, WH);
        const wG = new Float32Array(WW * WH);
        const wP = new Float32Array(WW * WH);
        for (let y = 0; y < WH; y++) {
          for (let x = 0; x < WW; x++) {
            const k = y * WW + x;
            const gx = x + WX;
            const gy = y + WY;
            wG[k] = smooth(625, 690, gy) * smooth(250, 330, gx) * (1 - smooth(870, 940, gx));
            wP[k] = gy * 0.045 + gx * 0.004;
          }
        }

        const drawLid = (p: number) => {
          if (p <= 0.01) return;
          const cx = 632;
          const cy = 361;
          const r = 45;
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.clip();
          ctx.fillStyle = "rgb(76,84,202)";
          ctx.fillRect(cx - r, cy - r, 2 * r, p * 2 * r + 1);
          ctx.restore();
          if (p > 0.85) {
            ctx.strokeStyle = "#1B2060";
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(cx - 34, cy + 1);
            ctx.quadraticCurveTo(cx, cy + 13, cx + 34, cy + 1);
            ctx.stroke();
          }
        };

        const frame = (now: number) => {
          frameId = requestAnimationFrame(frame);
          if (!visible || document.hidden || now - last < FRAME_MS) return;
          last = now;
          const t = now / 1000;
          ctx.clearRect(0, 0, W, H);
          ctx.drawImage(off, 0, 0);

          const phase = (t * Math.PI * 2) / 3.4;
          const td = tail.data;
          for (let k = 0, n = TW * TH; k < n; k++) {
            const o = k * 4;
            const w = tW[k];
            if (w < 0.002) {
              copyPixel(td, o, k % TW, (k / TW) | 0);
              continue;
            }
            const ang = AMP * w * Math.sin(phase - tR[k] / 90);
            const c = Math.cos(ang);
            const s = Math.sin(ang);
            bilinear(td, o, PX + c * tDx[k] + s * tDy[k], PY - s * tDx[k] + c * tDy[k]);
          }
          ctx.putImageData(tail, 0, 0);

          const phase2 = (t * Math.PI * 2) / 3.0;
          const wd = water.data;
          for (let k = 0, n = WW * WH; k < n; k++) {
            const o = k * 4;
            const g = wG[k];
            const x = k % WW;
            const y = (k / WW) | 0;
            if (g < 0.002) {
              copyPixel(wd, o, x + WX, y + WY);
              continue;
            }
            const sn = Math.sin(phase2 + wP[k]);
            bilinear(wd, o, x + WX + 7 * g * sn, y + WY + 1.5 * g * Math.cos(phase2 * 0.7 + wP[k]));
          }
          ctx.putImageData(water, WX, WY);

          let p = 0;
          if (blinkAt < 0 && now > nextBlink) blinkAt = now;
          if (blinkAt >= 0) {
            const u = (now - blinkAt) / 190;
            if (u >= 1) {
              blinkAt = -1;
              nextBlink = now + 2800 + Math.random() * 3200;
              if (Math.random() < 0.25) nextBlink = now + 280;
            } else {
              p = Math.min(1, (1 - Math.abs(2 * u - 1)) * 1.15);
            }
          }
          drawLid(p);
        };

        nextBlink = performance.now() + 1500;
        ctx.drawImage(off, 0, 0);
        setAlive(true);
        frameId = requestAnimationFrame(frame);

        const watched = visibilityRef.current;
        if (watched && "IntersectionObserver" in window) {
          observer = new IntersectionObserver((entries) => {
            visible = entries[0]?.isIntersecting ?? true;
          });
          observer.observe(watched);
        }
      } catch {
        cancelAnimationFrame(frameId);
        setAlive(false);
      }
    }

    void init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      observer?.disconnect();
      setAlive(false);
    };
  }, [imageRef, canvasRef, visibilityRef]);

  return alive;
}
