function showStatistics(statistics) {
  if (!statistics) return;

  const collisionTime = document.getElementById("collision-time");
  const leftStatistics = document.getElementById("left-statistics");
  const rightStatistics = document.getElementById("right-statistics");

  collisionTime.textContent =
    `Время столкновения: ${
      statistics.collisionTime != null
        ? Number(statistics.collisionTime).toFixed(2)
        : "—"
    } с`;

  leftStatistics.textContent =
    `Левая машина: средняя скорость ${
      Number(statistics.left.averageSpeed).toFixed(2)
    } м/с, расстояние ${
      Number(statistics.left.distance).toFixed(2)
    } м`;

  rightStatistics.textContent =
    `Правая машина: средняя скорость ${
      Number(statistics.right.averageSpeed).toFixed(2)
    } м/с, расстояние ${
      Number(statistics.right.distance).toFixed(2)
    } м`;
}