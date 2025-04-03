import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fakeAuth } from "../auth/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (fakeAuth.login(username, password)) {
      localStorage.setItem("auth", "true");
      navigate("/");
    } else {
      setError("Usuário ou senha incorretos");
    }
  };

  return (
    <div className="centered-page">
      <div className="card">
        <h1>Login atualizado</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Entrar</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
