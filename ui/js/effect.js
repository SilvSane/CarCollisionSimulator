
const EFFECT_SIZE = 4;
const GREEN_LIMIT = 40;

const effectVideo = document.createElement("video");
effectVideo.src = "media/collision.mp4";
effectVideo.preload = "auto";
effectVideo.muted = true;
effectVideo.playsInline = true;
effectVideo.style.cssText = "position:fixed;left:-9999px;top:0;width:2px;height:2px;";
document.body.appendChild(effectVideo);

effectVideo.onerror = () => {
    console.error("Ошибка видео:", effectVideo.error);
};

const effectCanvas = document.createElement("canvas");
const effectCtx = effectCanvas.getContext("2d", { willReadFrequently: true });

let effectOn = false;
let effectRequestId = 0;

function setCollisionEffectActive(active) {
    if (active === effectOn) return;

    effectOn = active;
    const id = ++effectRequestId;

    if (!active) {
        effectVideo.pause();
        return;
    }

    const start = () => {
        if (!effectOn || id !== effectRequestId) return;
        effectVideo.currentTime = 0;
        effectVideo.play().catch(error => console.error("Ошибка запуска:", error));
    };

    if (effectVideo.readyState >= 1) start();
    else effectVideo.addEventListener("loadedmetadata", start, { once: true });
}

function drawCollisionEffect(p, cx, cy, carWidthPx) {
    if (!effectOn || effectVideo.ended || effectVideo.readyState < 2 || !effectVideo.videoWidth) return;

    const w = effectCanvas.width = effectVideo.videoWidth;
    const h = effectCanvas.height = effectVideo.videoHeight;

    effectCtx.drawImage(effectVideo, 0, 0);

    const frame = effectCtx.getImageData(0, 0, w, h);
    const d = frame.data;

    for (let i = 0; i < d.length; i += 4) {
        if (d[i + 1] - Math.max(d[i], d[i + 2]) > GREEN_LIMIT) d[i + 3] = 0;
    }

    effectCtx.putImageData(frame, 0, 0);

    const drawW = carWidthPx * EFFECT_SIZE;
    const drawH = drawW * h / w;

    p.drawingContext.drawImage(effectCanvas, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
}
