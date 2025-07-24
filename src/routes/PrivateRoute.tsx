import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

interface PrivateRouteProps {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const pseudo = useUserStore((state) => state.pseudo);

  if (!pseudo) {
    return <Navigate to="/login" replace />;
  }

  return children;
}