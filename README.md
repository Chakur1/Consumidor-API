# API Consumer com Cache e Fallback

Um projeto de portfólio em **Node.js puro** que demonstra padrões avançados de resiliência para consumo de APIs externas: cache em memória com TTL, estratégia Cache-Aside e dois níveis de fallback.

---

## Conceitos Aplicados

| Conceito | Descrição |
|---|---|
| **Cache-Aside** | A aplicação gerencia o cache manualmente: verifica antes de chamar a API e atualiza após uma resposta bem-sucedida. |
| **TTL (Time To Live)** | Cada entrada no cache tem validade de 10 segundos. Após isso, o dado é considerado *stale* (vencido). |
| **Stale Cache Fallback** | Se a API falhar mas existir um dado vencido no cache, ele é retornado como fallback em vez de travar a aplicação. |
| **Timeout com AbortController** | Requisições à API são canceladas automaticamente se excederem 5 segundos, evitando que o programa trave aguardando uma resposta que nunca chega. |
| **Dois níveis de Fallback** | Fallback 1: cache vencido. Fallback 2: objeto padrão seguro. O programa nunca lança uma exceção não tratada para o usuário final. |

---

## Arquitetura

```
src/
├── api.js          # Comunicação externa (fetch + AbortController)
├── cache.js        # Cache em memória (Map + TTL)
├── userService.js  # Núcleo: Cache-Aside + 2 níveis de fallback
└── index.js        # Demonstração dos 4 cenários
```

A separação de responsabilidades segue o **Princípio da Responsabilidade Única**: cada módulo faz exatamente uma coisa.


---

## Como Rodar

**Pré-requisito:** Node.js v18 ou superior (para `fetch` nativo).

Para rodar o projeto, apenas dê o comando no terminal:
```bash
# Clone ou copie o projeto para sua máquina

# Entre na pasta do projeto
cd Consumidor-API

# Rode a demonstração
npm start
```

Não há dependências externas para instalar. O `npm install` não é necessário.

---

## O que você vai ver no terminal

A demonstração executa 4 cenários automaticamente:

- **Cenário A** — Chamada inicial: busca na API e salva no cache.
- **Cenário B** — Segunda chamada imediata: retorna do cache sem tocar na API.
- **Cenário C** — Após o TTL vencer (11s de espera), a API é forçada a falhar e o Fallback 1 (stale cache) é acionado.
- **Cenário D** — ID desconhecido + API falhando: nenhum cache existe, Fallback 2 retorna um objeto padrão seguro.

---

## Stack

- **Runtime:** Node.js (ES Modules)
- **HTTP:** `fetch` nativo (Node 18+)
- **Cache:** `Map` nativo do JavaScript
- **Dependências externas:** nenhuma

---

## Por que este projeto?

Sistemas de produção raramente funcionam em condições ideais. APIs ficam fora do ar, a rede falha, e respostas atrasam. Este projeto demonstra como construir um cliente de API resiliente que **degrada com elegância** em vez de travar ou lançar erros não tratados — uma habilidade essencial para qualquer desenvolvedor backend.
