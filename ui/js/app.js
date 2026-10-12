
const el = {
    leftEquation: document.getElementById("left-equation"),
    rightEquation: document.getElementById("right-equation"),
    checkButton: document.getElementById("check-button")
};


function updateCheckButtonState() {
    // Проверяем оба поля
    const leftValid = validateEquationField(el.leftEquation);
    const rightValid = validateEquationField(el.rightEquation);

    // После trim() в каждом поле должно быть больше 3 символов
    const leftLongEnough = el.leftEquation.value.trim().length > 3;
    const rightLongEnough = el.rightEquation.value.trim().length > 3;

    // Кнопка активна, только если оба поля заполнены корректно
    el.checkButton.disabled = !(
        leftValid &&
        rightValid &&
        leftLongEnough &&
        rightLongEnough
    );
}

el.leftEquation.addEventListener("input", updateCheckButtonState);
el.rightEquation.addEventListener("input", updateCheckButtonState);

// Проверяем начальное состояние при загрузке страницы
updateCheckButtonState();

