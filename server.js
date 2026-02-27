require('dotenv').config();
const { App } = require('@slack/bolt');
const { rewriteAllTones } = require('./openai');
const { getUserUsage, incrementUsage } = require('./database');
const { formatToneResponse, formatUpgradeMessage } = require('./slack');

// SIMPLE: Just token, no OAuth
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // Remove all the clientId, clientSecret, installationStore stuff
});

slackApp.command('/tone', async ({ command, ack, respond }) => {
  await ack();
  
  const userId = command.user_id;
  const text = command.text.trim();
  const words = text.split(' ');
  const firstWord = words[0].toLowerCase();
  
  let tone = 'diplomatic';
  let message = text;
  
  if (['direct', 'diplomatic', 'soft', 'casual', 'formal'].includes(firstWord)) {
    tone = firstWord;
    message = words.slice(1).join(' ');
  }
  
  if (!message) {
    await respond({
      text: "Please provide a message. Example: `/tone direct Hey, just checking in...`"
    });
    return;
  }
  
  const usage = await getUserUsage(userId);
  
  if (!usage.is_pro && usage.usage_count >= 10) {
    await respond(formatUpgradeMessage());
    return;
  }
  
  try {
    await respond({ text: "✍️ Rewriting..." });
    const tones = await rewriteAllTones(message);
    await incrementUsage(userId);
    const newUsage = await getUserUsage(userId);
    await respond(formatToneResponse(message, tones, newUsage));
  } catch (error) {
    console.error('Error:', error);
    await respond({ text: "Sorry, something went wrong. Try again!" });
  }
});

const PORT = process.env.PORT || 3000;

(async () => {
  await slackApp.start(PORT);
  console.log('⚡️ ToneBot running on port', PORT);
})();