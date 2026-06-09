/**
 * api.js — Responsável por toda comunicação com a API externa.
 *
 * Usa o fetch nativo do Node.js (sem axios ou outras libs).
 * Implementa AbortController para cancelar requisições que demorem demais.
 */

const BASE_URL = "https://jsonplaceholder.typicode.com";
const TIMEOUT_MS = 5000; 

/**
 * Busca um usuário pelo ID na JSONPlaceholder API.
 *
 * @param {number} id - ID do usuário a buscar.
 * @returns {Promise<Object>} Dados do usuário em formato JSON.
 * @throws {Error} Se a requisição falhar, ultrapassar o timeout ou retornar status não-ok.
 */
export async function fetchUser(id) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(id)}`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    
    if (error.name === "AbortError") {
      throw new Error(`Request timeout after ${TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    
    clearTimeout(timeoutId);
  }
}
