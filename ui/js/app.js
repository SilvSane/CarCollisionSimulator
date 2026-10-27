const el = {
  leftEquation: document.getElementById("left-equation"),
  rightEquation: document.getElementById("right-equation"),
  checkButton: document.getElementById("check-button"),
  startButton: document.getElementById("start-button"),  
  message: document.getElementById("message"),
};

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
      right: el.rightEquation.value
    }
  };

  try {
    el.message.textContent = "Проверка уравнений...";

    const result = await apiCheck(params);

    if (!result.isValid) {
      el.message.textContent = result.errors
        .map(error => error.message)
        .join(" ");
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
      el.message.textContent =
        `${directionsMessage} Столкновение возможно. ` +
        `Предполагаемое время: ${result.predictedCollisionTime} с.`;
    } else {
      el.message.textContent =
        `${directionsMessage} Столкновение не ожидается.`;
    }
  } catch (error) {
    console.error(error);
    el.message.textContent = "Не удалось проверить уравнения.";
  }
});

el.startButton.addEventListener("click", async function () {
  const params = {
    equations: {
      left: el.leftEquation.value,
      right: el.rightEquation.value
    }
  };

  try {
    el.message.textContent = "Выполняется симуляция...";

    const result = await apiRun(params);

    console.log("Результат симуляции:", result);
    console.log(
  "Последняя точка:",
  result.samples[result.samples.length - 1]
);
console.log("Ширина машины:", result.meta.carWidth);
    console.log("Первая точка:", result.samples[0]);
    console.log("Вторая точка:", result.samples[1]);
    console.log("Параметры сцены:", result.meta);
    animateScene(result.samples, result.meta.dt);


    el.message.textContent =
      `Симуляция завершена. Время столкновения: ${
        result.statistics.collisionTime
      } с.`;
  } catch (error) {
    console.error("Ошибка запуска симуляции:", error);
    el.message.textContent = "Не удалось выполнить симуляцию.";
  }
});

updateCheckButtonState();
initScene();