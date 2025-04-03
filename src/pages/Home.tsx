// src/pages/Home.tsx

import { useNavigate } from "react-router-dom";
import { fakeAuth } from "../auth/auth";

export default function Home() {
  const navigate = useNavigate();

  const logout = () => {
    fakeAuth.logout();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>Bem-vindo à Home</h1>
        <button style={styles.button} onClick={logout}>Sair</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef2f5",
  },
  box: {
    background: "#fff",
    padding: "3rem",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
  },
  button: {
    fontSize: "1rem",
    padding: "0.75rem 1.5rem",
    borderRadius: "5px",
    border: "none",
    background: "#dc3545",
    color: "#fff",
    cursor: "pointer",
  },
};
