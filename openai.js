const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TONE_PROMPTS = {
  direct: "Rewrite this message to be direct, clear, and action-oriented. Get to the point quickly. Remove filler words.",
  diplomatic: "Rewrite this message to be diplomatic and professional. Acknowledge the other person's perspective while communicating clearly.",
  soft: "Rewrite this message to be gentle and considerate. Soften any harsh edges while keeping the core message."
};

async function rewriteTone(text, tone) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: TONE_PROMPTS[tone] },
      { role: "user", content: text }
    ],
    temperature: 0.7,
    max_tokens: 500
  });
  return completion.choices[0].message.content.trim();
}

async function rewriteAllTones(text) {
  const tones = ['direct', 'diplomatic', 'soft'];
  const results = {};
  await Promise.all(tones.map(async (tone) => {
    results[tone] = await rewriteTone(text, tone);
  }));
  return results;
}

module.exports = { rewriteTone, rewriteAllTones, TONE_PROMPTS };