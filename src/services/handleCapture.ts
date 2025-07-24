export async function handleCapture(gameId: string, capturedPlayerId: string): Promise<boolean> {
  const token = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')?.currentSession?.access_token;

  if (!token) return false;

  const res = await fetch('https://xcqktvzbamdtyryzvywu.supabase.co/functions/v1/handleCapture', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ gameId, capturedPlayerId })
  });

  return res.ok;
}