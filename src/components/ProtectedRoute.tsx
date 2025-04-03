// src/components/ProtectedRoute.tsx

import { Navigate } from "react-router-dom";
import { fakeAuth } from "../auth/auth";

interface Props {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: Props) {
  if (!fakeAuth.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
