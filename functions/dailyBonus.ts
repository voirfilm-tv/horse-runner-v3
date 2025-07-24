// functions/dailyBonus.ts

import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
    });
  }

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('users')
    .select('coins, last_bonus')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: 'not_found' }), {
      status: 404,
    });
  }

  const last = data.last_bonus?.split('T')[0];
  if (last === today) {
    return new Response(JSON.stringify({ message: 'already_received' }), {
      status: 200,
    });
  }

  const { error: updateError } = await supabase
    .from('users')
    .update({
      coins: data.coins + 50,
      last_bonus: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (updateError) {
    return new Response(JSON.stringify({ error: 'update_failed' }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true, coins: data.coins + 50 }), {
    status: 200,
  });
});