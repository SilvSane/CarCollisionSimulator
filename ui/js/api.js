async function apiCheck(params) {
  const response = await fetch("data/check.json");
  return await response.json();
}
async function apiRun(params) {
  const response = await fetch("data/run.json");

  if (!response.ok) {
    throw new Error("Не удалось загрузить результат симуляции");
  }

  return await response.json();
}