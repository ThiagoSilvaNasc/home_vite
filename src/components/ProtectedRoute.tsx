import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

interface Props {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: Props) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Carregando...</p>;

  if (!user) return <Navigate to="/login" />;

  return children;
}
