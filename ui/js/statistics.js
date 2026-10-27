function showStatistics(statistics) {
  if (!statistics) return;

  const collisionTime = document.getElementById("collision-time");
  const leftStatistics = document.getElementById("left-statistics");
  const rightStatistics = document.getElementById("right-statistics");

  collisionTime.textContent =
    `Время столкновения: ${statistics.collisionTime} с`;

  leftStatistics.textContent =
    `Левая машина: средняя скорость ${statistics.left.averageSpeed} м/с, ` +
    `расстояние ${statistics.left.distance} м`;

  rightStatistics.textContent =
    `Правая машина: средняя скорость ${statistics.right.averageSpeed} м/с, ` +
    `расстояние ${statistics.right.distance} м`;
}
