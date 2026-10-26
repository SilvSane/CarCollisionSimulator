const el = {
  leftEquation: document.getElementById("left-equation"),
  rightEquation: document.getElementById("right-equation"),
  checkButton: document.getElementById("check-button"),
  message: document.getElementById("message"),
};

function updateCheckButtonState() {
  const leftFilled = el.leftEquation.value.trim() !== "";
  const rightFilled = el.rightEquation.value.trim() !== "";

  el.checkButton.disabled = !(leftFilled && rightFilled);
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

updateCheckButtonState();