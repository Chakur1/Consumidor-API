import { fetchUser } from "./api.js";
import * as cache from "./cache.js";

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";

function log(color, label, message) {
  console.log(`${color}[${label}]${RESET} ${message}`);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retorna os dados de um usuário seguindo o padrão Cache-Aside com fallback.
 *
 * @param {number} id - ID do usuário (inteiro positivo).
 * @param {Object} [options]
 * @param {boolean} [options.forceFailure] - Força falha da API (usado nos testes).
 * @returns {Promise<Object>} Dados do usuário (frescos, do cache ou padrão).
 */
export async function getUser(id, { forceFailure } = {}) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`ID inválido: ${id}`);
  }

  const cacheKey = `user:${id}`;

  // ── Passo 1: Verificar o cache ────────────────────────────────────────────
  const cached = cache.get(cacheKey);

  if (cached && cache.isValid(cached)) {
    log(GREEN, "CACHE HIT", `Dado fresco encontrado para a chave "${cacheKey}".`);
    return cached.data;
  }

  // ── Passo 2: Cache miss ou stale — tentar a API ───────────────────────────
  try {
    log(CYAN, "API CALL", `Buscando user:${id} na JSONPlaceholder...`);

    const data = forceFailure
      ? await simulateApiFail()
      : await fetchUser(id);

    cache.set(cacheKey, data);
    log(GREEN, "API OK", `Dado recebido e armazenado no cache.`);
    return data;

  } catch (apiError) {
    log(RED, "API ERROR", `Falha na requisição: ${apiError.message}`);

    // ── Fallback 1: Usar cache vencido (stale) se existir ─────────────────
    if (cached) {
      const age = Math.round((Date.now() - cached.savedAt) / 1000);
      log(YELLOW, "FALLBACK 1", `API falhou — usando cache vencido (${age}s atrás).`);
      return cached.data;
    }

    // ── Fallback 2: Sem cache algum — retornar objeto padrão seguro ───────
    log(RED, "FALLBACK 2", `API falhou e não há cache. Retornando dado padrão.`);
    return {
      id,
      name: "Usuário indisponível",
      email: "N/A",
      _fallback: true,
    };
  }
}

async function simulateApiFail() {
  await delay(100);
  throw new Error("Falha de API simulada para teste de fallback");
}
