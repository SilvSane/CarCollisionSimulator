async function apiCheck(params) {
  const response = await fetch(
    "http://localhost:5000/api/simulate/check",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...params,
        initialPositions: {
          left: 0,
          right: 10
        },
        carWidth: 1
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      `Ошибка проверки уравнений: HTTP ${response.status}`
    );
  }

  return await response.json();
}




async function apiRun(params) {
  const response = await fetch(
    "http://localhost:5000/api/simulate/run",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...params,
        initialPositions: {
          left: 0,
          right: 10
        },
        carWidth: 1
      })
    }
  );

  if (!response.ok) {
    throw new Error(
      `Ошибка запуска симуляции: HTTP ${response.status}`
    );
  }

  return await response.json();
}
