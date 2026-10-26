async function apiCheck(params) {
  const response = await fetch("data/check.json");
  return await response.json();
}