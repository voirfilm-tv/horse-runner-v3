export async function grantDailyBonus(): Promise<boolean> {
  const token = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')?.currentSession?.access_token;

  if (!token) {
    console.warn('Token utilisateur introuvable');
    return false;
  }

  const res = await fetch('https://xcqktvzbamdtyryzvywu.supabase.co/functions/v1/dailyBonus', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) return false;
  const data = await res.json();
  return data.success === true;
}