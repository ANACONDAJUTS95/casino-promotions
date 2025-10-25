# AI Features Setup Guide

## Overview

This project now includes AI-powered features using **Google Gemini 2.0 Flash** - the most cost-effective AI model available.

## Cost Breakdown

**Gemini 2.0 Flash Pricing:**
- Input: $0.075 per 1 million tokens
- Output: $0.30 per 1 million tokens

**Typical Usage Costs:**
- Single offer discovery (research 1 state): ~$0.01
- Offer quality analysis: ~$0.005
- Strategic recommendations: ~$0.01
- **Daily heavy usage (20-30 AI requests): ~$0.20**
- **Monthly cost (heavy usage): ~$6**

## Features Included

### 1. 🔍 **AI Offer Discovery**
- Researches current casino promotions in any state
- Finds missing casinos and new offers
- Returns structured data with confidence ratings
- **Use case**: Fill gaps in your database

### 2. 🧠 **AI Offer Quality Analysis**
- Deep analysis of offer terms and conditions
- Identifies hidden restrictions (wagering requirements, time limits, etc.)
- Provides overall quality score (0-100)
- Lists warnings and positive aspects
- **Use case**: Understand actual value vs advertised value

### 3. 🎯 **AI Strategic Recommendations**
- Analyzes all coverage gaps
- Generates prioritized action plan
- Estimates effort required for each recommendation
- **Use case**: Plan your research strategy efficiently

## Quick Setup (5 minutes)

### Step 1: Get Your Free API Key

1. Go to: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

**Note**: The free tier includes:
- 15 requests per minute
- 1,500 requests per day
- More than enough for this project!

### Step 2: Add API Key to Your Project

1. Create a file named `.env.local` in your project root (same folder as `package.json`)

2. Add this line to the file:
```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

3. Replace `your_api_key_here` with your actual API key from Step 1

**Example `.env.local` file:**
```bash
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

### Step 3: Restart Your Dev Server

1. Stop your dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. That's it! AI features are now enabled ✨

## How to Use AI Features

### Using AI Offer Discovery

1. Click "Run Search" on the home page
2. Click "Show Insights" button
3. You'll see an "AI-Powered Research Tools" section
4. Select a state (e.g., "Pennsylvania")
5. Click "Research [State] Offers"
6. Wait 3-5 seconds for AI to research and return results
7. Review discovered offers with confidence ratings

**What it does:**
- Searches for casino promotions in that state
- Focuses on missing casinos from your database
- Returns offers with deposit/bonus amounts
- Provides source information and notes

### Using AI Offer Analysis

1. Click any offer row in the table to expand it
2. Scroll down to the "AI Deep Analysis" section (purple gradient)
3. Click "Analyze Quality"
4. Wait 2-3 seconds for analysis
5. Review:
   - Overall quality score
   - Actual value estimate
   - Hidden restrictions
   - Warnings
   - Positive aspects

**What it does:**
- Analyzes offer for hidden terms
- Estimates wagering requirements
- Identifies time restrictions
- Provides honest assessment of value

### Using AI Strategic Recommendations

1. Make sure you have coverage gaps identified
2. In the Insights Dashboard, scroll to "AI Strategy Recommendations"
3. Click "Generate Strategy"
4. Wait 3-5 seconds
5. Review prioritized action items with effort estimates

**What it does:**
- Analyzes all identified gaps
- Creates prioritized research plan
- Suggests which gaps to tackle first
- Estimates effort required

## Troubleshooting

### "AI Features Not Configured" Warning

**Problem**: API key not detected

**Solutions**:
1. Make sure `.env.local` exists in project root
2. Check the filename is exactly `.env.local` (not `.env` or `.env.local.txt`)
3. Verify the variable name is `NEXT_PUBLIC_GEMINI_API_KEY`
4. Make sure you restarted the dev server after adding the file
5. Check for typos in your API key

### "Failed to discover offers" Error

**Possible causes**:
1. Invalid API key
2. Rate limit exceeded (15 requests/minute)
3. Network connection issue
4. API service temporarily down

**Solutions**:
1. Verify your API key is correct
2. Wait 1 minute and try again
3. Check your internet connection
4. Try again in a few minutes

### AI Responses Are Slow

**This is normal!** AI analysis takes 2-5 seconds because:
- The model needs to process your request
- It's generating intelligent, context-aware responses
- It's searching and analyzing data

**Tips**:
- Only use AI features when you need them
- Don't spam the buttons (respect rate limits)
- The algorithm-based scoring is instant - use that for quick results

## Best Practices

### When to Use AI

✅ **Use AI for:**
- Discovering new offers you don't have
- Analyzing complex offer terms
- Planning research strategy
- Understanding hidden restrictions

❌ **Don't use AI for:**
- Scoring existing offers (algorithm does this instantly)
- Basic filtering/sorting (UI controls handle this)
- Repeated analysis of same offer (save the first result)

### Cost Management

**Free Tier Limits:**
- 15 requests per minute
- 1,500 requests per day

**Tips to stay within limits:**
- Don't click AI buttons repeatedly
- Save AI analysis results when you find them useful
- Use algorithmic features first, AI features second
- One AI research per state per day is usually enough

### Data Quality

**Confidence Ratings:**
- **High**: AI found clear, recent information
- **Medium**: Information is available but may need verification
- **Low**: AI is making educated guesses - verify manually

**Always verify:**
- Visit casino websites to confirm offers
- Check terms and conditions
- Verify bonus amounts and deposit requirements
- AI provides leads, you confirm accuracy

## Privacy & Security

**Your API Key:**
- Keep it private (never commit `.env.local` to git)
- Don't share it publicly
- Regenerate it if accidentally exposed

**Data Sent to AI:**
- Only offer names, amounts, and casino names
- No personal information
- No sensitive data
- All prompts are in this file: `lib/ai/gemini-service.ts`

## Advanced: Customizing AI Prompts

Want to adjust how AI responds? Edit `lib/ai/gemini-service.ts`:

```typescript
// Example: Make AI more conservative in estimates
const prompt = `You are a conservative casino promotions analyst...
Be realistic and conservative in your analysis...`;
```

All prompts are clearly documented in the service file.

## Technical Details

**Model Used**: `gemini-2.0-flash-exp`
- Latest experimental version
- Fastest response times
- Lowest cost
- High quality results

**SDK**: `@google/generative-ai` (official Google package)
**Response Format**: JSON (structured data)
**Error Handling**: Automatic retries and user-friendly messages

## Support

**Common Questions:**

**Q: Is this free?**
A: Yes! Free tier includes 1,500 requests/day. Even heavy usage costs ~$6/month.

**Q: Why Gemini instead of ChatGPT?**
A: Gemini Flash is 10x cheaper and faster. Perfect for this use case.

**Q: Can I use Claude instead?**
A: Yes, but it costs more. Gemini 2.0 Flash is optimized for cost and speed.

**Q: Is my API key safe?**
A: Yes, it's only stored locally in `.env.local` (not in git).

**Q: Can others use my deployed app?**
A: If you deploy, API key is embedded. Set usage limits in Google Console.

**Q: What if I hit rate limits?**
A: Free tier: 15 req/min, 1,500/day. Wait a minute or upgrade (rarely needed).

## Next Steps

1. ✅ Get API key (5 minutes)
2. ✅ Add to `.env.local`
3. ✅ Restart dev server
4. ✅ Try AI Offer Discovery
5. ✅ Try AI Quality Analysis
6. ✅ Generate Strategy Recommendations
7. ✅ Show evaluators your AI-powered research tool!

---

**Ready to use AI!** Start with offer discovery to find new promotions, then use quality analysis to understand their actual value. 🚀

