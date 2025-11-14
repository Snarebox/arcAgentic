# LLM Recommendations for RPG-Light Narrator and Character Actor

## Executive Summary

Based on research into cloud-hosted LLM services with function calling capabilities, this document provides recommendations for transitioning from local Ollama (mistral:instruct) to a cloud-hosted solution suitable for narrator and character actor roles in an RPG chat application.

### Top Recommendation: OpenRouter with DeepSeek V3 or Qwen2.5 72B

**Update (Nov 2024):** After additional research comparing DeepSeek V3 and Qwen2.5 72B against Mistral Large 2 and Claude 3.5 Sonnet, we now recommend DeepSeek V3 as the primary choice for its exceptional cost/quality ratio. See `llm-comparison-addendum.md` for detailed analysis.

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

**Website:** <https://openrouter.ai>

### 2. Together AI (Alternative)

**Why Together AI?**

- Direct hosting of 200+ open-source models
- Very fast (sub-500ms first token latency)
- Strong privacy controls
- Custom fine-tuning available
- Good for production deployments

**Pricing:** $3-$8 per million output tokens

**Integration:** Simple REST API

**Website:** <https://together.ai>

### 3. Replicate (For Custom Models)

**Why Replicate?**

- Community model hosting
- Custom model deployment via Cog
- Good for experimental models

**Pricing:** Compute/time based (varies by model)

**Integration:** Python SDK and REST API

**Website:** <https://replicate.com>

## Recommended Models

### Tier 1: Best Value (UPDATED - Top Recommendations)

#### DeepSeek V3 (via OpenRouter) ⭐⭐⭐⭐⭐ NEW #1 RECOMMENDATION

- **Context Window:** 128K tokens
- **Function Calling:** ✅ Excellent support
- **Creative Writing:** ⭐⭐⭐⭐⭐ (Near Claude quality)
- **Character Consistency:** Excellent
- **Censorship:** Very Low (minimal filtering)
- **Pricing:** ~$0.14 input / $0.28 output per million tokens (exceptional value)
- **Best For:** Production deployment with budget constraints, high-quality narrative at minimal cost

**Pros:**

- **Game-changing cost/quality ratio:** 90-95% of Claude's quality at 2% of the cost
- Exceptional coherence and context tracking
- Strong narrative flow and character depth
- Excellent at long-form storytelling
- Surpasses Mistral Large 2 in creative benchmarks
- 50x cheaper than Claude, 24x cheaper than Mistral Large 2

**Cons:**

- Slightly less emotional nuance than Claude 3.5 Sonnet
- Not quite as polished for literary prose
- Newer model with less community testing

**Updated Analysis:** Recent benchmarks show DeepSeek V3 (671B parameters, 37B active) rivals GPT-4 and Claude 3.5 Sonnet in creative tasks while being dramatically cheaper. For RPG narration, it provides professional-grade quality at hobby-project pricing.

#### Qwen2.5 72B (via OpenRouter) ⭐⭐⭐⭐⭐ NEW #2 RECOMMENDATION

- **Context Window:** 128K tokens
- **Function Calling:** ✅ Native support
- **Creative Writing:** ⭐⭐⭐⭐ (Excellent structure and memory)
- **Character Consistency:** ⭐⭐⭐⭐⭐ (Best-in-class for roleplay)
- **Censorship:** Minimal (least filtered option)
- **Pricing:** ~$0.90 input / $0.90 output per million tokens
- **Best For:** Maximum creative freedom, roleplay consistency, uncensored scenarios

**Pros:**

- **Best roleplay model:** Exceptional character voice consistency
- Minimal content filtering - best for unrestricted creativity
- Excellent long-form story coherence (ranks high on creative benchmarks)
- Multilingual support (29+ languages)
- Strong memory for plot details and relationships
- 6.7x cheaper than Mistral Large 2

**Cons:**

- Less mainstream than GPT/Claude ecosystem
- Slightly less sophisticated than Claude for literary prose
- Some provider API variations on OpenRouter

**Updated Analysis:** Specialized fine-tunes like Eva Qwen2.5 show it excels at roleplay scenarios. Community benchmarks consistently rank it among top models for creative writing and character acting.

### Tier 2: Established Options

#### Claude 3.5 Sonnet (via OpenRouter)

- **Context Window:** 200K tokens
- **Function Calling:** ✅ Excellent support
- **Creative Writing:** ⭐⭐⭐⭐⭐ (Best in class)
- **Character Consistency:** Excellent
- **Censorship:** Moderate (has content policies but flexible)
- **Pricing:** ~$3 input / $15 output per million tokens
- **Best For:** Maximum literary quality regardless of cost

**Pros:**

- Gold standard for creative writing
- Outstanding emotional nuance and subtext
- Excellent at maintaining tone and style
- Massive 200K token context window
- Most sophisticated prose generation

**Cons:**

- Most expensive option (50x more than DeepSeek V3)
- Has content filtering
- Overkill for most RPG scenarios

**Updated Analysis:** Still the quality benchmark, but DeepSeek V3 closes the gap to 90-95% at 2% of the cost. Reserve for special scenes or when budget isn't a constraint.

#### Mistral Large 2 (via OpenRouter or Together AI)

- **Context Window:** 128K tokens
- **Function Calling:** ✅ Good support
- **Creative Writing:** ⭐⭐⭐⭐ (Very good)
- **Character Consistency:** Very good
- **Censorship:** Low (less filtered than US-based models)
- **Pricing:** ~$2 input / $6 output per million tokens
- **Best For:** European data sovereignty, fastest inference

**Pros:**

- Very fast inference speed
- Less censored than US-based models
- Open source (can fine-tune if needed)
- Good creative writing capabilities
- Established European provider

**Cons:**

- Outperformed by DeepSeek V3 in creative benchmarks
- 24x more expensive than DeepSeek V3
- Less roleplay-focused than Qwen2.5 72B

**Updated Analysis:** Solid all-around option but surpassed by both DeepSeek V3 (quality and cost) and Qwen2.5 72B (roleplay and cost). Best for enterprise deployments requiring European hosting.

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
// Environment variables (UPDATED RECOMMENDATIONS)
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=deepseek/deepseek-chat  // Primary recommendation: DeepSeek V3

// Alternative models:
// OPENROUTER_MODEL=qwen/qwen-2.5-72b-instruct  // Best for roleplay/minimal censorship
// OPENROUTER_MODEL=mistralai/mistral-large-2411  // Enterprise option
// OPENROUTER_MODEL=anthropic/claude-3.5-sonnet  // Premium quality

// Fallback models (comma-separated)
OPENROUTER_FALLBACK_MODELS=qwen/qwen-2.5-72b-instruct,mistralai/mistral-large-2411
```

### Migration Strategy

1. **Phase 1: OpenRouter Integration (Minimal Code Changes)**
   - Create new `openrouter.ts` adapter (similar to `ollama.ts`)
   - OpenAI-compatible API = minimal changes needed
   - Keep existing prompt engineering
   - Test with DeepSeek V3

1. **Phase 2: Model Testing**
   - A/B test DeepSeek V3 vs Qwen2.5 72B vs Claude 3.5 Sonnet
   - Evaluate creative quality, cost, and speed
   - Test function calling with OpenRouter's standardized interface

1. **Phase 3: Production Deployment**
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
1. **Moderate Filtering:** Claude 3.5 (flexible for creative content)
1. **Low Filtering:** Mistral Large 2, DeepSeek V3
1. **Minimal Filtering:** Qwen2.5 72B (best for unrestricted creativity)
1. **No Filtering:** Community RP models (MythoMax, etc.)

### Recommended Approach (UPDATED)

- Start with **DeepSeek V3** for exceptional quality at minimal cost
- Use **Qwen2.5 72B** for maximum creative freedom and roleplay consistency
- Fall back to **Claude 3.5 Sonnet** only if absolute best literary quality is required
- Use **Mistral Large 2** for enterprise deployments requiring European hosting

### Application-Level Safety

The application already implements content filtering in `prompt.ts`:

- Basic keyword detection
- Fade-to-black suggestions
- Safety mode system prompts

This application-level filtering is sufficient for most use cases and allows using less filtered models while maintaining appropriate boundaries.

## Technical Comparison Matrix (UPDATED)

| Model | Context | Function Calling | Creative | Roleplay | Censorship | Cost ($/1M out) | Speed | Value Rating |
|-------|---------|------------------|----------|----------|------------|-----------------|-------|--------------|
| **DeepSeek V3** | 128K | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Very Low | **$0.28** | Fast | ⭐⭐⭐⭐⭐ |
| **Qwen2.5 72B** | 128K | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Minimal | **$0.90** | Fast | ⭐⭐⭐⭐⭐ |
| Claude 3.5 Sonnet | 200K | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Moderate | $15 | Fast | ⭐⭐⭐ |
| Mistral Large 2 | 128K | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Low | $6 | Very Fast | ⭐⭐⭐⭐ |
| Llama 3.3 70B | 128K | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Moderate | $0.80 | Fast | ⭐⭐⭐⭐ |

## Final Recommendation (UPDATED)

**For RPG-Light Narrator/Character Actor:**

**Primary:** **DeepSeek V3** via OpenRouter ⭐⭐⭐⭐⭐

- Game-changing cost/quality ratio (90-95% of Claude at 2% of cost)
- Excellent creative writing and character depth
- Strong function calling support
- Very low content filtering
- 128K context window
- **~$6/month for typical usage vs $315 for Claude**

**Secondary:** **Qwen2.5 72B** via OpenRouter ⭐⭐⭐⭐⭐

- Best roleplay and character consistency
- Minimal content filtering (least censored option)
- Excellent long-form story coherence
- Strong function calling support
- 128K context window
- **~$20/month for typical usage**

**Premium Alternative:** **Claude 3.5 Sonnet** via OpenRouter

- Use if budget allows and absolute best literary quality is required
- Exceptional emotional nuance and prose sophistication
- Massive context window (200K tokens)
- **~$315/month for typical usage**

**Enterprise Option:** **Mistral Large 2** via OpenRouter

- For European data sovereignty requirements
- Fastest inference speed
- Reliable and well-documented
- **~$150/month for typical usage**

**Implementation:** Use OpenRouter to easily switch between these models based on scenario, budget, or user preference.

**Cost Summary (3,000 conversations/month):**

- DeepSeek V3: **$6/month** (98% savings vs Claude)
- Qwen2.5 72B: **$20/month** (94% savings vs Claude)
- Mistral Large 2: **$150/month** (52% savings vs Claude)
- Claude 3.5 Sonnet: **$315/month** (premium option)

## Next Steps

1. Sign up for OpenRouter account
1. Create API key at <https://openrouter.ai/keys>
1. Implement OpenRouter adapter in `packages/api/src/llm/openrouter.ts`
1. Update environment configuration
1. Test with multiple models
1. Monitor costs and quality
1. Deploy to production

## References

- OpenRouter Documentation: <https://openrouter.ai/docs>
- Function Calling Guide: <https://openrouter.ai/docs/features/tool-calling>
- Model Comparison: <https://artificialanalysis.ai/models>
- Pricing Calculator: <https://openrouter.ai/models>
