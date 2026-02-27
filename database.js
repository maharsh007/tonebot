const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getUserUsage(userId) {
  const { data } = await supabase.from('users').select('usage_count, is_pro').eq('slack_user_id', userId).single();
  if (!data) {
    await supabase.from('users').insert({ slack_user_id: userId, usage_count: 0, is_pro: false });
    return { usage_count: 0, is_pro: false };
  }
  return data;
}

async function incrementUsage(userId) {
  const { data } = await supabase.from('users').select('usage_count').eq('slack_user_id', userId).single();
  const newCount = (data?.usage_count || 0) + 1;
  await supabase.from('users').update({ usage_count: newCount }).eq('slack_user_id', userId);
  return newCount;
}

module.exports = { getUserUsage, incrementUsage };