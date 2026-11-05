const el = {
  leftEquation: document.getElementById("left-equation"),
  rightEquation: document.getElementById("right-equation"),
  checkButton: document.getElementById("check-button"),
  startButton: document.getElementById("start-button"),
  message: document.getElementById("message"),
  dtSelect: document.getElementById("dt-select"),
  animationSpeed: document.getElementById("animation-speed"),
};

function setMessage(text, type = "") {
  if (!el.message) return;
  el.message.textContent = text;
  el.message.className = type;
}

function updateCheckButtonState() {
  const leftFilled = el.leftEquation.value.trim() !== "";
  const rightFilled = el.rightEquation.value.trim() !== "";

  el.checkButton.disabled = !(leftFilled && rightFilled);
  el.startButton.disabled = true;
}

el.leftEquation.addEventListener("input", updateCheckButtonState);
el.rightEquation.addEventListener("input", updateCheckButtonState);

el.checkButton.addEventListener("click", async function () {
  const leftValid = validateEquationField(el.leftEquation);
  const rightValid = validateEquationField(el.rightEquation);

  if (!leftValid || !rightValid) {
    return;
  }

  const params = {
    equations: {
      left: el.leftEquation.value,
      right: el.rightEquation.value,
    },
    dt: Number(el.dtSelect.value),
  };

  try {
    setMessage("Проверка уравнений...", "");

    const result = await apiCheck(params);

    if (!result.isValid) {
      setMessage(
        result.errors.map((error) => error.message).join(" "),
        "error",
      );
      return;
    }

    el.startButton.disabled = false;

    const leftDirection =
      result.directions.left === "right" ? "вправо" : "влево";
    const rightDirection =
      result.directions.right === "right" ? "вправо" : "влево";

    const directionsMessage =
      `Левая машина движется ${leftDirection}. ` +
      `Правая машина движется ${rightDirection}.`;

    if (result.willCollide) {
      setMessage(
        `${directionsMessage} Столкновение возможно. Предполагаемое время: ${
          result.predictedCollisionTime != null
            ? Number(result.predictedCollisionTime).toFixed(2)
            : "—"
        } с.`,
        "success",
      );
    } else {
      setMessage(`${directionsMessage} Столкновение не ожидается.`, "error");
    }
  } catch (error) {
    console.error(error);
    setMessage("Не удалось проверить уравнения.", "error");
  }
});

el.startButton.addEventListener("click", async function () {
  const params = {
    equations: {
      left: el.leftEquation.value,
      right: el.rightEquation.value,
    },
    dt: Number(el.dtSelect.value),
  };

  try {
    setMessage("Выполняется симуляция...", "");
    const result = await apiRun(params);

    showStatistics(result.statistics);
    document.getElementById("export-btn").disabled = false;

    animateScene(
      result.samples,
      result.meta.dt,
      Number(el.animationSpeed.value),
    );
    drawPositionGraph(result.samples);

    setMessage("Симуляция завершена.", "success");
  } catch (error) {
    console.error("Ошибка запуска симуляции:", error);
    setMessage("Не удалось выполнить симуляцию.", "error");
  }
});

updateCheckButtonState();
initScene();

// ==========================================
// ЭКСПОРТ РЕЗУЛЬТАТОВ В CSV
// ==========================================
document.getElementById("export-btn").addEventListener("click", function () {
  if (
    typeof animationSamples === "undefined" ||
    !animationSamples ||
    animationSamples.length === 0
  ) {
    return;
  }

  let csvContent = "\uFEFF" + "Time,LeftCar,RightCar\n";

  for (let i = 0; i < animationSamples.length; i++) {
    const sample = animationSamples[i];
    csvContent += `${sample.t},${sample.left},${sample.right}\n`;
  }

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "simulation_results.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

// ==========================================
// ИМПОРТ РЕЗУЛЬТАТОВ ИЗ CSV
// ==========================================
document
  .getElementById("import-file")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;
      const lines = text.split(/\r?\n/);
      const newSamples = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(",");
        if (parts.length !== 3) continue;

        const t = Number(parts[0]);
        const left = Number(parts[1]);
        const right = Number(parts[2]);

        if (
          !Number.isFinite(t) ||
          !Number.isFinite(left) ||
          !Number.isFinite(right)
        )
          continue;

        newSamples.push({ t, left, right });
      }

      if (newSamples.length === 0) {
        setMessage("Ошибка: в файле нет подходящих данных.", "error");
        return;
      }

      newSamples.sort((a, b) => a.t - b.t);

      stopAnimationTimer();

      animationSamples = newSamples;
      animationIndex = 0;
      animationPlaying = false;
      animationStartTime = newSamples[0].t;
      animationDuration =
        newSamples[newSamples.length - 1].t - animationStartTime;

      const allPositions = newSamples.flatMap((sample) => [
        sample.left,
        sample.right,
      ]);
      const minPosition = Math.min(...allPositions);
      const maxPosition = Math.max(...allPositions);
      const padding = Math.max((maxPosition - minPosition) * 0.1, 2);

      sceneSketch.setWorldBounds(minPosition - padding, maxPosition + padding);
      updateScene(newSamples[0]);
      drawPositionGraph(newSamples);

      initTimeline();
      configureTimeline(
        animationDuration,
        seekAnimation,
        toggleAnimationPlayback,
      );
      updateTimeline(0, animationDuration, false);

      document.getElementById("export-btn").disabled = false;
      setMessage("Данные успешно загружены из файла!", "success");
    };

    reader.onerror = function () {
      setMessage("Ошибка при чтении файла.", "error");
    };

    reader.readAsText(file);
    event.target.value = "";
  });
