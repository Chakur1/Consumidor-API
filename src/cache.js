/**
 * cache.js — Cache em memória com TTL (Time To Live).
 *
 * Armazena pares chave/valor em um Map nativo do JavaScript.
 * Cada entrada guarda o dado e o timestamp de quando foi salvo,
 * permitindo validar se o dado ainda está "fresco" ou "vencido" (stale).
 */

// TTL curto para facilitar a demonstração dos cenários de fallback.
const TTL_MS = 10_000; 

const store = new Map();

/**
 * Salva um dado no cache junto com o timestamp atual.
 *
 * @param {string} key - Chave de identificação (ex: "user:1").
 * @param {*} data - Dado a ser armazenado.
 */
export function set(key, data) {
  store.set(key, { data, savedAt: Date.now() });
}

/**
 * Recupera a entrada completa do cache (dado + metadata).
 * Retorna undefined se a chave não existir.
 *
 * @param {string} key
 * @returns {{ data: any, savedAt: number } | undefined}
 */
export function get(key) {
  return store.get(key);
}

/**
 * Verifica se uma entrada de cache ainda está dentro do TTL.
 *
 * @param {{ savedAt: number }} entry - Entrada retornada por get().
 * @returns {boolean} true se o dado ainda é válido.
 */
export function isValid(entry) {
  return Date.now() - entry.savedAt < TTL_MS;
}
