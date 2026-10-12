const EQUATION_CHARS = /^[0-9t.,+*\/^(): \-]$/;


// Проверка одного символа
function isValidEquationChar(ch) {
    return EQUATION_CHARS.test(ch);
}


// Проверка всего поля с уравнением
function validateEquationField(input) {
    const value = input.value;

    // 1. Проверяем каждый символ
    for (const ch of value) {
        if (!isValidEquationChar(ch)) {
            input.classList.add("invalid");
            return false;
        }
    }

    // 2. Не допускаем несколько десятичных разделителей подряд
    if (/[.,]{2,}/.test(value)) {
        input.classList.add("invalid");
        return false;
    }

    // Все проверки пройдены
    input.classList.remove("invalid");
    return true;
}
