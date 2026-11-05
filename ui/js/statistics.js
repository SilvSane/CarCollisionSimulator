function showStatistics(statistics) {
  if (!statistics) return;

  const collisionTime = document.getElementById("collision-time");
  const leftStatistics = document.getElementById("left-statistics");
  const rightStatistics = document.getElementById("right-statistics");

  if (collisionTime) {
    collisionTime.textContent =
      statistics.collisionTime != null
        ? `${Number(statistics.collisionTime).toFixed(2)} с`
        : "—";
    collisionTime.classList.remove("empty");
  }

  if (leftStatistics) {
    // Возвращаем понятные подписи для цифр
    leftStatistics.innerHTML = `Скорость: ${Number(statistics.left.averageSpeed).toFixed(2)} м/с<br>Расстояние: ${Number(statistics.left.distance).toFixed(2)} м`;
    leftStatistics.classList.remove("empty");
  }

  if (rightStatistics) {
    rightStatistics.innerHTML = `Скорость: ${Number(statistics.right.averageSpeed).toFixed(2)} м/с<br>Расстояние: ${Number(statistics.right.distance).toFixed(2)} м`;
    rightStatistics.classList.remove("empty");
  }
}
