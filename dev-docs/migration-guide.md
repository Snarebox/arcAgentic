# Migration Guide: From Ollama to OpenRouter

This guide walks through migrating from local Ollama (mistral:instruct) to cloud-hosted OpenRouter LLMs.

## Overview

The migration is designed to be minimal and surgical:

1. Add OpenRouter adapter (already created at `packages/api/src/llm/openrouter.ts`)
1. Update environment configuration
1. Modify server.ts to use OpenRouter instead of Ollama
1. Test and deploy

## Prerequisites

1. **OpenRouter Account**

- Sign up at <https://openrouter.ai>
- Create API key at <https://openrouter.ai/keys>
- Add initial credits ($5-10 recommended for testing)

1. **Choose Your Model**
   - Recommended: `mistralai/mistral-large-2411` (best balance)
   - Premium: `anthropic/claude-3.5-sonnet` (best quality)
   - Budget: `deepseek/deepseek-chat` (cheapest)
   - See `dev-docs/llm-recommendations.md` for full comparison

## Step 1: Update Environment Configuration

### In `packages/api/.env.example`

Add new OpenRouter variables:

```bash
# OpenRouter (cloud LLM provider)
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=mistralai/mistral-large-2411

# Ollama (deprecated - for local development only)
# OLLAMA_BASE_URL=http://localhost:11434
# OLLAMA_MODEL=mistral:instruct
```

### In your actual `.env` file

```bash
OPENROUTER_API_KEY=your_actual_key_here
OPENROUTER_MODEL=mistralai/mistral-large-2411
# Optional fallback models (comma-separated)
# OPENROUTER_FALLBACK_MODELS=anthropic/claude-3.5-sonnet,deepseek/deepseek-chat
```

## Step 2: Update Config Utility

### In `packages/api/src/util/config.ts`

Add OpenRouter configuration:

```typescript
export interface Config {
  port: number;
  contextWindow: number;
  temperature: number;
  topP: number;
  // Add OpenRouter fields
  openrouterApiKey?: string;
  openrouterModel?: string;
  openrouterFallbackModels?: string[];
  // Keep Ollama for backward compatibility
  ollamaBaseUrl: string;
  ollamaModel?: string;
}

export function getConfig(): Config {
  return {
    port: Number(process.env.PORT ?? 3001),
    contextWindow: Number(process.env.CONTEXT_WINDOW ?? 12),
    temperature: Number(process.env.TEMPERATURE ?? 0.7),
    topP: Number(process.env.TOP_P ?? 0.9),
    // OpenRouter configuration
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
    openrouterModel: process.env.OPENROUTER_MODEL,
    openrouterFallbackModels: process.env.OPENROUTER_FALLBACK_MODELS?.split(',').map((m) =>
      m.trim(),
    ),
    // Ollama (backward compatible)
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
    ollamaModel: process.env.OLLAMA_MODEL,
  };
}
```

## Step 3: Update Server to Use OpenRouter

### In `packages/api/src/server.ts`

Replace the Ollama call with OpenRouter:

```typescript
import { chatWithOpenRouter } from './llm/openrouter.js';
// Keep this for backward compatibility: import { chatWithOllama } from './llm/ollama.js'

// In the POST /sessions/:id/messages handler, replace:

const cfg = getConfig();

// Determine which LLM to use
const useOpenRouter = !!(cfg.openrouterApiKey && cfg.openrouterModel);

if (!useOpenRouter && !cfg.ollamaModel) {
  return c.json(
    {
      ok: false,
      error:
        'Missing LLM configuration. Set either OPENROUTER_API_KEY + OPENROUTER_MODEL or OLLAMA_MODEL',
    },
    500,
  );
}

const messages = buildPrompt({ character, setting, history, historyWindow: cfg.contextWindow });
console.info(`Session ${session.id}: calling LLM with ${messages.length} messages`);

let result;
if (useOpenRouter) {
  console.info(`Using OpenRouter model: ${cfg.openrouterModel}`);
  result = await chatWithOpenRouter({
    apiKey: cfg.openrouterApiKey!,
    model: cfg.openrouterModel!,
    messages,
    options: {
      temperature: cfg.temperature,
      top_p: cfg.topP,
    },
  });
} else {
  console.info(`Using Ollama model: ${cfg.ollamaModel}`);
  result = await chatWithOllama({
    baseUrl: cfg.ollamaBaseUrl,
    model: cfg.ollamaModel!,
    messages,
    options: {
      temperature: cfg.temperature,
      top_p: cfg.topP,
    },
  });
}

if (result.error) {
  console.error(`Session ${session.id}: LLM error -> ${result.error}`);
  return c.json({ ok: false, error: result.error }, 502);
}
```

## Step 4: Update Health Check

### In `packages/api/src/util/health.ts`

Add OpenRouter health check (optional):

```typescript
export async function checkOpenRouter(apiKey: string | undefined): Promise<{ ok: boolean }> {
  if (!apiKey) {
    return { ok: false };
  }

  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(5000),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
```

### Update `/health` endpoint in `server.ts`

```typescript
app.get('/health', async (c) => {
  const uptime = process.uptime();
  const version = await getVersion();

  // DB check
  let dbOk = false;
  try {
    const { prisma } = await import('./db/prisma.js');
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (error) {
    console.warn('Database health check failed', error);
  }

  const cfg = getConfig();

  // Check OpenRouter if configured
  const openrouter = cfg.openrouterApiKey
    ? await checkOpenRouter(cfg.openrouterApiKey).catch(() => ({ ok: false }))
    : { ok: false, message: 'not configured' };

  // Check Ollama for backward compatibility
  const ollama = await checkOllama(cfg.ollamaBaseUrl).catch(() => ({ ok: false }));

  const llmOk = openrouter.ok || ollama.ok;

  return c.json(
    {
      status: dbOk && llmOk ? 'ok' : 'degraded',
      uptime,
      version,
      db: { ok: dbOk },
      llm: {
        openrouter: cfg.openrouterApiKey ? openrouter : { ok: false, message: 'not configured' },
        ollama: cfg.ollamaModel ? ollama : { ok: false, message: 'not configured' },
      },
    },
    200,
  );
});
```

## Step 5: Update Config Endpoint

### In `server.ts` `/config` endpoint

```typescript
app.get('/config', (c) => {
  const cfg = getConfig();
  return c.json(
    {
      port: cfg.port,
      contextWindow: cfg.contextWindow,
      temperature: cfg.temperature,
      topP: cfg.topP,
      llm: {
        provider: cfg.openrouterApiKey ? 'openrouter' : 'ollama',
        model: cfg.openrouterModel || cfg.ollamaModel,
        openrouterAvailable: !!cfg.openrouterApiKey,
        ollamaAvailable: !!cfg.ollamaModel,
      },
    },
    200,
  );
});
```

## Step 6: Update Documentation

### In `README.md`

Update the configuration section:

```markdown
## Configuration

The API reads environment variables with sensible defaults for local development.

- `PORT` (default: `3001`)
- `DATABASE_URL` (default: `file:./prisma/dev.db` inside the API package)

### LLM Configuration (choose one):

**Cloud-hosted (recommended for production):**

- `OPENROUTER_API_KEY` - Your OpenRouter API key
- `OPENROUTER_MODEL` - Model to use (e.g., `mistralai/mistral-large-2411`)
- See `dev-docs/llm-recommendations.md` for model recommendations

**Local development (requires Ollama):**

- `OLLAMA_BASE_URL` (default: `http://localhost:11434`)
- `OLLAMA_MODEL` (e.g., `mistral:instruct`)

**Generation parameters:**

- `CONTEXT_WINDOW` (default: `12`) — how many recent turns to include
- `TEMPERATURE` (default: `0.7`) — generation temperature
- `TOP_P` (default: `0.9`) — nucleus sampling parameter

Example env file: `packages/api/.env.example`
```

## Step 7: Test the Migration

### 7.1 Build the project

```bash
pnpm -w build
```

### 7.2 Set up your environment

```bash
cd packages/api
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY
```

### 7.3 Start the server

```bash
pnpm -F @minimal-rpg/api dev
```

### 7.4 Test the health endpoint

```bash
curl http://localhost:3001/health
```

Should show OpenRouter as available.

### 7.5 Test a conversation

```bash
# Create a session
curl -X POST http://localhost:3001/sessions \
  -H "Content-Type: application/json" \
  -d '{"characterId": "example-knight", "settingId": "example-tavern"}'

# Send a message (use session ID from above)
curl -X POST http://localhost:3001/sessions/YOUR_SESSION_ID/messages \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello! What brings you to this tavern?"}'
```

## Step 8: Monitor and Optimize

### Cost Monitoring

Check your OpenRouter dashboard:

- <https://openrouter.ai/activity>

Monitor:

- Daily token usage
- Cost per conversation
- Model performance

### Optimization Tips

1. **Context Window Management**
   - Current: 12 turns = ~10K-20K tokens
   - Consider reducing to 8-10 for cost savings
   - Large context (128K-200K) is available but rarely needed

1. **Model Selection**
   - Start with Mistral Large 2 ($6/million output tokens)
   - Switch to Claude 3.5 Sonnet if quality issues arise
   - Fall back to DeepSeek for cost-sensitive scenarios

1. **Prompt Optimization**
   - Keep system prompts concise
   - Truncate older conversation history more aggressively
   - Use summarization for very long conversations

## Rollback Plan

If you need to rollback to Ollama:

1. Comment out OpenRouter environment variables
1. Set `OLLAMA_MODEL=mistral:instruct`
1. Restart the server
1. The code maintains backward compatibility

## Troubleshooting

### "Missing LLM configuration" error

- Ensure either OPENROUTER_API_KEY + OPENROUTER_MODEL or OLLAMA_MODEL is set
- Check .env file is in correct location and loaded

### "OpenRouter error 401"

- Invalid API key
- Check key at <https://openrouter.ai/keys>
- Ensure no extra whitespace in .env

### "OpenRouter error 402"

- Insufficient credits
- Add credits at <https://openrouter.ai/credits>

### Model not found error

- Check model name is correct: <https://openrouter.ai/models>
- Some models require explicit opt-in for data usage policies

### Slow responses

- Check model latency: <https://openrouter.ai/models>
- Consider switching to faster model (Together AI models are usually fastest)
- Reduce context window size

## Cost Estimation

Based on your usage patterns:

**Light usage (100 conversations/day, 15K tokens per conversation):**

- Mistral Large 2: ~$150/month
- Claude 3.5 Sonnet: ~$315/month
- DeepSeek V3: ~$20/month

**Moderate usage (500 conversations/day):**

- Mistral Large 2: ~$750/month
- Claude 3.5 Sonnet: ~$1,575/month
- DeepSeek V3: ~$100/month

## Next Steps

1. ✅ Complete this migration
1. Monitor usage and costs for 1-2 weeks
1. Fine-tune context window and temperature settings
1. Consider implementing model switching based on conversation type
1. Explore function calling for enhanced features (dice rolls, inventory, etc.)

## Support

- OpenRouter Docs: <https://openrouter.ai/docs>
- OpenRouter Discord: <https://discord.gg/fVyRaUDgxW>
- Model comparisons: <https://artificialanalysis.ai/models>
