// functions/validateGame.ts

import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!
  );

  const { gameId } = await req.json();

  const { data, error } = await supabase
    .from('games')
    .select('winner, players_state')
    .eq('id', gameId)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: 'Game not found' }), { status: 404 });
  }

  const valid = data.winner || Object.keys(data.players_state || {}).length >= 2;

  return new Response(JSON.stringify({ valid }), { status: 200 });
});