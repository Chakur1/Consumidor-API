import { getUser } from "./userService.js";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  const SEPARATOR = "─".repeat(55);

  console.log("\n" + SEPARATOR);
  console.log("  API Consumer com Cache e Fallback — Demonstração");
  console.log(SEPARATOR + "\n");

  // ── Cenário A: Chamada normal — vai na API e salva no cache ──────────────
  console.log(">>> CENÁRIO A: Chamada inicial (API → Cache)\n");
  const userA = await getUser(1);
  console.log(`    Nome: ${userA.name} | Email: ${userA.email}\n`);

  await delay(500);

  // ── Cenário B: Chamada imediata — Cache Hit garantido ────────────────────
  console.log(SEPARATOR);
  console.log(">>> CENÁRIO B: Segunda chamada imediata (Cache Hit)\n");
  const userB = await getUser(1);
  console.log(`    Nome: ${userB.name} | Email: ${userB.email}\n`);

  await delay(500);

  // ── Cenário C: Fallback com dado vencido (stale) ─────────────────────────
  // Aguardamos 11s para o TTL (10s) vencer, depois forçamos falha na API.
  console.log(SEPARATOR);
  console.log(">>> CENÁRIO C: Aguardando TTL vencer (11s)...\n");
  console.log("    (O cache vai expirar, a API vai falhar e o fallback será acionado)\n");

  await delay(11_000);

  const userC = await getUser(1, { forceFailure: true });
  console.log(`    Nome: ${userC.name} | Email: ${userC.email}`);
  if (userC._fallback) {
    console.log("    (Dado padrão — Fallback 2 acionado)");
  }

  await delay(500);

  // ── Cenário D (bônus): Fallback 2 — sem cache nenhum + API falhando ──────
  console.log("\n" + SEPARATOR);
  console.log(">>> CENÁRIO D (bônus): ID novo + API falhando = Fallback 2\n");
  const userD = await getUser(999, { forceFailure: true });
  console.log(`    Nome: ${userD.name} | Fallback: ${userD._fallback ?? false}\n`);

  console.log(SEPARATOR);
  console.log("  Demonstração concluída.");
  console.log(SEPARATOR + "\n");
})();
