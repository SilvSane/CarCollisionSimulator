
let sceneSketch = null;
let simulationTimeElement = null;

function initScene(containerId = "scene") {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Контейнер сцены #${containerId} не найден`);
    return;
  }
    simulationTimeElement = document.getElementById("simulation-time");

  if (sceneSketch) {
    sceneSketch.remove();
  }

  sceneSketch = new p5((p) => {
    const roadY = 0.6;
    let leftPosition = null;
    let rightPosition = null;
    let worldMin = -4;
    let worldMax = 14;

    p.setup = () => {
      const width = container.clientWidth || 600;
      const height = 220;

      const canvas = p.createCanvas(width, height);
      canvas.parent(container);

      p.textFont("Arial");
    };

      p.setCarPositions = (left, right) => {
          leftPosition = left;
          rightPosition = right;
      };
      p.setWorldBounds = (min, max) => {
        worldMin = min;
        worldMax = max;
      };

    p.draw = () => {
        if (leftPosition === null || rightPosition === null) {

} else {
      p.background(245);

      const roadYpx = p.height * roadY;

      const margin = 70;

      const worldToScreen = (x) =>
        margin +
        ((x - worldMin) / (worldMax - worldMin)) * (p.width - margin * 2);


      const carWidthPx = Math.abs(worldToScreen(1) - worldToScreen(0));

      p.noStroke();
      p.fill(90);
      p.rect(0, roadYpx - 28, p.width, 56);
      p.stroke(255);
      p.strokeWeight(2);
      p.drawingContext.setLineDash([14, 10]);
      p.line(0, roadYpx, p.width, roadYpx);
      p.drawingContext.setLineDash([]);
      drawCar(
        p,
        worldToScreen(leftPosition),
        roadYpx - 15,
        "Левая",
        "Blue",
        carWidthPx
      );

      drawCar(
        p,
        worldToScreen(rightPosition),
        roadYpx - 15,
        "Правая",
        "Red",
        carWidthPx
      );
    }};


function drawCar(p, x, y, label, color, carWidthPx) {
  p.rectMode(p.CENTER);
  p.noStroke();
  p.fill(color);
  p.rect(x, y, carWidthPx, 28, 6);
  p.fill(210, 230, 245);
  p.rect(x, y - 5, carWidthPx * 0.48, 14, 4);
  p.fill(35);
  p.ellipse(x - carWidthPx * 0.3, y + 13, 14, 14);
  p.ellipse(x + carWidthPx * 0.3, y + 13, 14, 14);
  p.fill(30);
  p.textAlign(p.CENTER);
  p.textSize(12);
  p.text(label, x, y - 24);

  p.rectMode(p.CORNER);
}


    p.windowResized = () => {
      const width = container.clientWidth || 600;
      p.resizeCanvas(width, 220);
    };
  });
}



let sceneAnimationId = null;
let animationSamples = [];
let animationIndex = 0;
let animationPlaying = false;
let animationStepMs = 50;
let animationStartTime = 0;
let animationDuration = 0;

function updateScene(sample) {
  if (!sceneSketch || !sample) return;

  sceneSketch.setCarPositions(sample.left, sample.right);
}

function renderAnimationFrame(index) {
  if (animationSamples.length === 0) return;

  animationIndex = Math.max(
    0,
    Math.min(index, animationSamples.length - 1)
  );

  const sample = animationSamples[animationIndex];

  updateScene(sample);

  updateTimeline(
    sample.t - animationStartTime,
    animationDuration,
    animationPlaying
  );
}

function stopAnimationTimer() {
  if (sceneAnimationId !== null) {
    clearInterval(sceneAnimationId);
    sceneAnimationId = null;
  }
}

function startAnimationTimer() {
  stopAnimationTimer();

  if (
    !animationPlaying ||
    animationSamples.length < 2 ||
    animationIndex >= animationSamples.length - 1
  ) {
    animationPlaying = false;
    updateTimeline(
      animationSamples[animationIndex]?.t - animationStartTime || 0,
      animationDuration,
      false
    );
    return;
  }

  sceneAnimationId = setInterval(() => {
    animationIndex++;

    if (animationIndex >= animationSamples.length - 1) {
      animationIndex = animationSamples.length - 1;
      animationPlaying = false;
      stopAnimationTimer();
      renderAnimationFrame(animationIndex);
      return;
    }

    renderAnimationFrame(animationIndex);
  }, animationStepMs);
}


function seekAnimation(fraction) {
  if (animationSamples.length === 0) return;

  // Немедленно останавливаем воспроизведение при перемотке.
  animationPlaying = false;
  stopAnimationTimer();

  const targetTime =
    animationStartTime +
    Math.max(0, Math.min(1, fraction)) * animationDuration;

  let index = 0;

  while (
    index < animationSamples.length - 1 &&
    animationSamples[index + 1].t < targetTime
  ) {
    index++;
  }

  if (
    index < animationSamples.length - 1 &&
    targetTime > animationSamples[index].t
  ) {
    const first = animationSamples[index];
    const second = animationSamples[index + 1];

    const span = second.t - first.t;
    const ratio = span > 0
      ? (targetTime - first.t) / span
      : 0;

    updateScene({
      t: targetTime,
      left: first.left + (second.left - first.left) * ratio,
      right: first.right + (second.right - first.right) * ratio
    });

    animationIndex = index;

    updateTimeline(
      targetTime - animationStartTime,
      animationDuration,
      false
    );

    return;
  }

  renderAnimationFrame(index);
  updateTimeline(
    targetTime - animationStartTime,
    animationDuration,
    false
  );
}


function toggleAnimationPlayback() {
  if (animationSamples.length === 0) return;

  if (animationPlaying) {
    animationPlaying = false;
    stopAnimationTimer();

    updateTimeline(
      animationSamples[animationIndex].t - animationStartTime,
      animationDuration,
      false
    );

    return;
  }

  if (animationIndex >= animationSamples.length - 1) {
    animationIndex = 0;
    renderAnimationFrame(0);
  }

  animationPlaying = true;
  updateTimeline(
    animationSamples[animationIndex].t - animationStartTime,
    animationDuration,
    true
  );

  startAnimationTimer();
}

function animateScene(samples, dt = 0.05, animationSpeedMs = 100) {
  if (!sceneSketch || !samples || samples.length === 0) return;

  stopAnimationTimer();

  animationSamples = samples;
  animationIndex = 0;
  animationPlaying = true;
  animationStepMs = animationSpeedMs;
  animationStartTime = samples[0].t;
  animationDuration =
    samples[samples.length - 1].t - animationStartTime;
  const allPositions = samples.flatMap(sample => [
    sample.left,
    sample.right
  ]);

  const minPosition = Math.min(...allPositions);
  const maxPosition = Math.max(...allPositions);

  const padding = Math.max((maxPosition - minPosition) * 0.1, 2);

  sceneSketch.setWorldBounds(
    minPosition - padding,
    maxPosition + padding
  );

  initTimeline();

  configureTimeline(
    animationDuration,
    seekAnimation,
    toggleAnimationPlayback
  );

  renderAnimationFrame(0);
  startAnimationTimer();
}

