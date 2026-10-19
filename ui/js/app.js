const el = {
  leftEquation: document.getElementById("left-equation"),
  rightEquation: document.getElementById("right-equation"),
  checkButton: document.getElementById("check-button"),
};

function updateCheckButtonState() {
  const leftFilled = el.leftEquation.value.trim() !== "";
  const rightFilled = el.rightEquation.value.trim() !== "";

  el.checkButton.disabled = !(leftFilled && rightFilled);
}

el.leftEquation.addEventListener("input", updateCheckButtonState);
el.rightEquation.addEventListener("input", updateCheckButtonState);

el.checkButton.addEventListener("click", function () {
  const leftValid = validateEquationField(el.leftEquation);
  const rightValid = validateEquationField(el.rightEquation);



});

updateCheckButtonState();