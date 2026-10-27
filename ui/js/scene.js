
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

    p.draw = () => {
        if (leftPosition === null || rightPosition === null) {

} else {
      p.background(245);

      const roadYpx = p.height * roadY;
      const margin = 45;
      const worldMin = -4;
      const worldMax = 14;

      const worldToScreen = (x) =>
        margin +
        ((x - worldMin) / (worldMax - worldMin)) * (p.width - margin * 2);

      const carWidthPx = 66;

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

function updateScene(sample) {
  if (!sceneSketch || !sample) return;

  sceneSketch.setCarPositions(sample.left, sample.right);

  if (simulationTimeElement) {
    simulationTimeElement.textContent = `Время: ${sample.t.toFixed(3)} с`;
  }
}

function animateScene(samples, dt = 0.05) {
  if (!sceneSketch || !samples || samples.length === 0) return;

  if (sceneAnimationId !== null) {
    clearInterval(sceneAnimationId);
  }

  let index = 0;

  updateScene(samples[index]);

  sceneAnimationId = setInterval(() => {
    index++;

    if (index >= samples.length) {
      clearInterval(sceneAnimationId);
      sceneAnimationId = null;
      return;
    }

    updateScene(samples[index]);
  }, dt * 1000);
}
