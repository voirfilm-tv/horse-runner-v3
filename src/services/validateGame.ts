export async function validateGame(gameId: string): Promise<boolean> {
  const token = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')?.currentSession?.access_token;

  if (!token) return false;

  const res = await fetch('https://xcqktvzbamdtyryzvywu.supabase.co/functions/v1/validateGame', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ gameId })
  });

  if (!res.ok) return false;

  const data = await res.json();
  return data.valid === true;
}