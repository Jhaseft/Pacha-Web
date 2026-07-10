import { useAuth } from '@/context/AuthContext';

export function useIsAnfitriona() {
  const { user } = useAuth();
  return user?.role === 'ANFITRIONA';
}
