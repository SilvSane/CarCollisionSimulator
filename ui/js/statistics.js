function showStatistics(statistics) {
  if (!statistics) return;

  const message = document.getElementById("message");

  message.innerHTML =
    `Время столкновения: ${statistics.collisionTime} с<br>` +
    `Левая машина: средняя скорость ${statistics.left.averageSpeed} м/с, ` +
    `расстояние ${statistics.left.distance} м<br>` +
    `Правая машина: средняя скорость ${statistics.right.averageSpeed} м/с, ` +
    `расстояние ${statistics.right.distance} м`;
}