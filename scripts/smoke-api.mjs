import assert from "node:assert/strict";

const base = process.env.BASE_URL || "http://localhost:3000";
const cases = [
  ["/api/paint-search", 400],
  ["/api/paint-search?make=Ford&year=bad", 400],
  ["/api/paint-search?code=ABC", null],
  ["/api/label-locations", 400],
  ["/api/label-locations?make=Ford", null],
];
let failures = 0;

for (const [path, expected] of cases) {
  try {
    const response = await fetch(base + path);
    const body = await response.json();
    const passed = expected === null ? [200, 503].includes(response.status) : response.status === expected;
    console.log(passed ? "PASS" : "FAIL", response.status, path, JSON.stringify(body).slice(0, 140));
    if (!passed) failures++;
  } catch (error) {
    console.error("FAIL", path, error.message);
    failures++;
  }
}

try {
  const health = await fetch(base + "/api/health");
  const body = await health.json();
  assert.equal(health.status, 200);
  assert.equal(body.status, "ok");
  assert.equal(body.indexingEnabled, false, "indexing must remain disabled");
  console.log("PASS", health.status, "/api/health indexing remains disabled");

  const [robotsResponse, homeResponse] = await Promise.all([fetch(base + "/robots.txt"), fetch(base + "/")]);
  const robots = await robotsResponse.text();
  const home = await homeResponse.text();
  assert.match(robots, /Disallow:\s*\//i);
  assert.match(home, /noindex/i);
  console.log("PASS", "robots.txt and homepage retain no-index controls");
} catch (error) {
  console.error("FAIL release/indexing check", error.message);
  failures++;
}

if (failures) process.exit(1);
