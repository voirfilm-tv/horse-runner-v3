// functions/handleCapture.ts

import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!
  );

  const { gameId, capturedPlayerId } = await req.json();

  const { error } = await supabase
    .from('players')
    .update({ position: -1 })
    .eq('id', capturedPlayerId)
    .eq('game_id', gameId);

  if (error) {
    return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});