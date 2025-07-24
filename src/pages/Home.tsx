import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/services/auth';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/lobby');
      } else {
        navigate('/login');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100">
      <img src="/assets/images/ui/logo.png" alt="Logo" className="w-40 mb-6" />
      <p className="text-gray-600">Redirection en cours...</p>
    </div>
  );
}