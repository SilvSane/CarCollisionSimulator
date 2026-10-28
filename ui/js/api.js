async function apiCheck(params) {
  const response = await fetch("/api/simulate/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...params,
      initialPositions: {
        left: 0,
        right: 10,
      },
      carWidth: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ошибка проверки уравнений: HTTP ${response.status}`);
  }

  return await response.json();
}

async function apiRun(params) {
  const requestBody = {
    equations: {
      left: params.equations.left,
      right: params.equations.right,
    },
    initialPositions: {
      left: 0.0,
      right: 10.0,
    },
    carWidth: 1.0,
    dt: params.dt,
  };

  console.log("Запрос на запуск симуляции:", requestBody);

  const response = await fetch("/api/simulate/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Ошибка запуска симуляции: HTTP ${response.status}. ${errorText}`,
    );
  }

  return await response.json();
}
