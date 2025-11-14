# LLM Recommendations for RPG-Light Narrator and Character Actor

## Executive Summary

Based on research into cloud-hosted LLM services with function calling capabilities, this document provides recommendations for transitioning from local Ollama (mistral:instruct) to a cloud-hosted solution suitable for narrator and character actor roles in an RPG chat application.

**Top Recommendation: OpenRouter with Claude 3.5 Sonnet or Mistral Large 2**

## Requirements Analysis

- ✅ Function calling capability (tool use)
- ✅ Large context window (for maintaining conversation history)
- ✅ Uncensored or minimally censored (for creative roleplay scenarios)
- ✅ Cloud-hosted (local hosting no longer viable)
- ✅ Strong creative writing and character acting capabilities
- ✅ Reasonable cost structure

## Recommended Cloud Platforms

### 1. OpenRouter (Primary Recommendation) ⭐

**Why OpenRouter?**
- Unified API gateway to 50+ LLM providers (OpenAI, Anthropic, Meta, Alibaba, DeepSeek, etc.)
- Single API key and consolidated billing across all providers
- OpenAI SDK compatible (drop-in replacement)
- Model switching without code changes
- Access to both censored and less censored models
- Built-in rate limiting and fallback support
- ~25-40ms added latency (negligible for chat applications)

**Pricing:** Pay-per-use, varies by model ($1-$75 per million tokens)

**Integration:** OpenAI-compatible API, simple migration path

**Website:** https://openrouter.ai

### 2. Together AI (Alternative)

**Why Together AI?**
- Direct hosting of 200+ open-source models
- Very fast (sub-500ms first token latency)
- Strong privacy controls
- Custom fine-tuning available
- Good for production deployments

**Pricing:** $3-$8 per million output tokens

**Integration:** Simple REST API

**Website:** https://together.ai

### 3. Replicate (For Custom Models)

**Why Replicate?**
- Community model hosting
- Custom model deployment via Cog
- Good for experimental models

**Pricing:** Compute/time based (varies by model)

**Integration:** Python SDK and REST API

**Website:** https://replicate.com

## Recommended Models

### Tier 1: Premium Quality (Best for Narrator/Character Actor)

#### Claude 3.5 Sonnet (via OpenRouter)
- **Context Window:** 200K tokens
- **Function Calling:** ✅ Excellent support
- **Creative Writing:** ⭐⭐⭐⭐⭐ (Best in class)
- **Character Consistency:** Excellent
- **Censorship:** Moderate (has content policies but flexible)
- **Pricing:** ~$3 input / $15 output per million tokens
- **Best For:** High-quality narrative, complex character interactions, long-form storytelling

**Pros:**
- Exceptional creative writing and roleplay capabilities
- Outstanding character consistency over long conversations
- Excellent at maintaining tone and style
- Best-in-class emotional nuance and subtext
- Massive 200K token context window

**Cons:**
- More expensive than alternatives
- Has some content filtering (though less strict than GPT-4)
- Not fully uncensored

#### Mistral Large 2 (via OpenRouter or Together AI)
- **Context Window:** 128K tokens
- **Function Calling:** ✅ Good support
- **Creative Writing:** ⭐⭐⭐⭐ (Very good)
- **Character Consistency:** Very good
- **Censorship:** Low (less filtered than US-based models)
- **Pricing:** ~$2 input / $6 output per million tokens
- **Best For:** Cost-effective high-quality narrative, European-hosted option

**Pros:**
- Excellent value for money
- Less censored than US-based models
- Open source (can fine-tune if needed)
- Good creative writing capabilities
- Large 128K context window
- Fast inference speed

**Cons:**
- Slightly less nuanced than Claude for creative writing
- May have some repetition in very long conversations

### Tier 2: Uncensored Options with Function Calling

#### DeepSeek V3 (via OpenRouter)
- **Context Window:** 64K tokens
- **Function Calling:** ✅ Supported
- **Creative Writing:** ⭐⭐⭐ (Good)
- **Censorship:** Low (Chinese model, different filtering standards)
- **Pricing:** ~$0.27 input / $1.10 output per million tokens (very cheap)
- **Best For:** Budget-conscious projects with fewer content restrictions

**Pros:**
- Very affordable
- Less content filtering than Western models
- Good performance for the price
- Supports function calling

**Cons:**
- Not specifically optimized for creative writing
- Smaller context window than premium options
- May have occasional translation artifacts

#### Qwen2.5-72B-Instruct (via Together AI or OpenRouter)
- **Context Window:** 32K-128K tokens (varies by provider)
- **Function Calling:** ✅ Supported
- **Creative Writing:** ⭐⭐⭐ (Good)
- **Censorship:** Low (Alibaba model, minimal filtering)
- **Pricing:** ~$0.90 input / $0.90 output per million tokens
- **Best For:** Uncensored applications with function calling needs

**Pros:**
- Very minimal content filtering
- Good technical capabilities
- Affordable pricing
- Strong function calling support

**Cons:**
- Not specifically optimized for narrative/roleplay
- May require more prompt engineering for creative tasks

### Tier 3: Budget/Experimental Options

#### Llama 3.3 70B (via OpenRouter or Together AI)
- **Context Window:** 128K tokens
- **Function Calling:** ✅ Supported (via Ollama-style tools)
- **Creative Writing:** ⭐⭐⭐ (Good)
- **Censorship:** Moderate (has some filtering, but fine-tuned versions available)
- **Pricing:** ~$0.50 input / $0.80 output per million tokens
- **Best For:** Open-source enthusiasts, budget deployments

#### Mythomax 13B / MythoLogic (Specialized for RP)
- **Context Window:** 8K-32K tokens
- **Function Calling:** ⚠️ Limited or via custom implementation
- **Creative Writing:** ⭐⭐⭐⭐ (Excellent for roleplay)
- **Censorship:** None (designed for uncensored roleplay)
- **Pricing:** Very cheap ($0.10-0.30 per million tokens)
- **Best For:** Roleplay-specific scenarios, highly uncensored content

**Note:** These smaller RP-specific models may not have native function calling but can be used with wrapper implementations.

## Implementation Recommendations

### Recommended Approach: OpenRouter with Model Flexibility

```typescript
// Environment variables
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet  // or mistralai/mistral-large-2411

// Fallback models (comma-separated)
OPENROUTER_FALLBACK_MODELS=mistralai/mistral-large-2411,meta-llama/llama-3.3-70b-instruct
```

### Migration Strategy

1. **Phase 1: OpenRouter Integration (Minimal Code Changes)**
   - Create new `openrouter.ts` adapter (similar to `ollama.ts`)
   - OpenAI-compatible API = minimal changes needed
   - Keep existing prompt engineering
   - Test with Claude 3.5 Sonnet

2. **Phase 2: Model Testing**
   - A/B test Claude 3.5 Sonnet vs Mistral Large 2
   - Evaluate creative quality, cost, and speed
   - Test function calling with OpenRouter's standardized interface

3. **Phase 3: Production Deployment**
   - Deploy with chosen model
   - Implement fallback models for reliability
   - Monitor costs and quality

### Cost Estimation

Based on typical usage patterns for an RPG chat application:

**Light Usage (100 conversations/day):**
- Average: 10K tokens input + 5K tokens output per conversation
- Daily: 1M input tokens + 500K output tokens

With Claude 3.5 Sonnet:
- Daily cost: ~$10.50 ($3 input + $7.50 output)
- Monthly cost: ~$315

With Mistral Large 2:
- Daily cost: ~$5 ($2 input + $3 output)
- Monthly cost: ~$150

**Note:** Costs can be reduced significantly by using smaller context windows and implementing intelligent message truncation.

## Function Calling Implementation

All recommended models support function calling via OpenRouter's standardized interface:

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [...],
    tools: [
      {
        type: 'function',
        function: {
          name: 'get_character_info',
          description: 'Retrieve character information',
          parameters: {
            type: 'object',
            properties: {
              character_id: { type: 'string' }
            }
          }
        }
      }
    ]
  })
});
```

## Safety and Content Policies

### Content Filtering Levels
1. **Highest Filtering:** OpenAI GPT-4 (not recommended for uncensored RP)
2. **Moderate Filtering:** Claude 3.5 (flexible for creative content)
3. **Low Filtering:** Mistral Large, DeepSeek, Qwen
4. **Minimal/No Filtering:** Community RP models (MythoMax, etc.)

### Recommended Approach
- Start with **Mistral Large 2** for best balance of quality, cost, and freedom
- Fall back to **Claude 3.5 Sonnet** if creative quality is paramount
- Use **DeepSeek V3** for maximum freedom at lowest cost

### Application-Level Safety
The application already implements content filtering in `prompt.ts`:
- Basic keyword detection
- Fade-to-black suggestions
- Safety mode system prompts

This application-level filtering is sufficient for most use cases and allows using less filtered models while maintaining appropriate boundaries.

## Technical Comparison Matrix

| Model | Context | Function Calling | Creative | Censorship | Cost ($/1M out) | Speed |
|-------|---------|------------------|----------|------------|-----------------|-------|
| Claude 3.5 Sonnet | 200K | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Moderate | $15 | Fast |
| Mistral Large 2 | 128K | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Low | $6 | Very Fast |
| DeepSeek V3 | 64K | ⭐⭐⭐⭐ | ⭐⭐⭐ | Low | $1.10 | Fast |
| Qwen2.5-72B | 128K | ⭐⭐⭐⭐ | ⭐⭐⭐ | Very Low | $0.90 | Fast |
| Llama 3.3 70B | 128K | ⭐⭐⭐ | ⭐⭐⭐ | Moderate | $0.80 | Fast |

## Final Recommendation

**For RPG-Light Narrator/Character Actor:**

**Primary:** **Mistral Large 2** via OpenRouter
- Best overall balance of creative quality, cost, and freedom
- Excellent function calling support
- Less censored than Claude while maintaining high quality
- Large context window (128K tokens)
- European hosting may be beneficial for data privacy

**Premium Alternative:** **Claude 3.5 Sonnet** via OpenRouter
- Use if budget allows and best-in-class creative quality is required
- Exceptional character consistency and emotional nuance
- Massive context window (200K tokens)

**Budget Option:** **DeepSeek V3** via OpenRouter
- Use for cost-sensitive deployments
- Good performance at very low cost
- Minimal content filtering

**Implementation:** Use OpenRouter to easily switch between these models based on scenario, budget, or user preference.

## Next Steps

1. Sign up for OpenRouter account
2. Create API key at https://openrouter.ai/keys
3. Implement OpenRouter adapter in `packages/api/src/llm/openrouter.ts`
4. Update environment configuration
5. Test with multiple models
6. Monitor costs and quality
7. Deploy to production

## References

- OpenRouter Documentation: https://openrouter.ai/docs
- Function Calling Guide: https://openrouter.ai/docs/features/tool-calling
- Model Comparison: https://artificialanalysis.ai/models
- Pricing Calculator: https://openrouter.ai/models
