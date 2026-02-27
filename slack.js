function formatToneResponse(original, tones, userUsage) {
    const { direct, diplomatic, soft } = tones;
    const remaining = Math.max(0, 10 - userUsage.usage_count);
    
    return {
      blocks: [
        { type: "section", text: { type: "mrkdwn", text: "*Original:*\n>" + original } },
        { type: "divider" },
        { type: "section", text: { type: "mrkdwn", text: `🎯 *Direct:*\n>${direct}` } },
        { type: "section", text: { type: "mrkdwn", text: `🤝 *Diplomatic:*\n>${diplomatic}` } },
        { type: "section", text: { type: "mrkdwn", text: `💭 *Soft:*\n>${soft}` } },
        ...(remaining <= 3 && !userUsage.is_pro ? [{
          type: "context",
          elements: [{ type: "mrkdwn", text: `⚠️ *${remaining} uses left.* Upgrade for unlimited.` }]
        }] : [])
      ]
    };
  }
  
  function formatUpgradeMessage() {
    return {
      blocks: [
        { type: "section", text: { type: "mrkdwn", text: "🎉 You've used your 10 free tones!" } },
        { type: "section", text: { type: "mrkdwn", text: "*ToneBot Pro:*\n• Unlimited rewrites\n• Team tone guidelines\n• $12/month" } },
        { type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: "Upgrade" }, url: "https://stripe.com", style: "primary" }] }
      ]
    };
  }
  
  module.exports = { formatToneResponse, formatUpgradeMessage };