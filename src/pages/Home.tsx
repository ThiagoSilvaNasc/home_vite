import { useNavigate } from "react-router-dom";
import { fakeAuth } from "../auth/auth";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebaseDatabase";

type Evento = {
  timestamp: string;
  usuario: string;
  CodUsuario: string;
  veiculo: string;
  CodVeiculo: string;
  PlacaVeiculo: string;
  litros: number;
  local: string;
};

export default function Home() {
  const navigate = useNavigate();

  const logout = () => {
    fakeAuth.logout();
    navigate("/login");
  };

  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    const eventosRef = ref(database, "eventos");

    onValue(eventosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed: Evento[] = Object.entries(data).map(([key, value]: any) => ({
          timestamp: new Date(Number(value.timestamp) * 1000).toLocaleString("pt-BR"),
          usuario: value.usuario,
          CodUsuario: value.CodUsuario,
          veiculo: value.veiculo,
          CodVeiculo: value.CodVeiculo,
          PlacaVeiculo: value.PlacaVeiculo,
          litros: value.litros,
          local: value.local,
        }));

        parsed.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)); // mais recentes no topo
        setEventos(parsed);
      }
    });
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.headerTitle}>Dashboard</h2>
        <button style={styles.logoutButton} onClick={logout}>
          Sair
        </button>
      </header>

      <div style={styles.contentBox}>
        <h1 style={styles.title}>Eventos de Abastecimento</h1>
        <div style={styles.scrollBox}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Usuário</th>
                <th>Veículo</th>
                <th>Placa</th>
                <th>Litros</th>
                <th>Local</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento, index) => (
                <tr key={index}>
                  <td>{evento.timestamp}</td>
                  <td>{evento.usuario}</td>
                  <td>{evento.veiculo}</td>
                  <td>{evento.PlacaVeiculo}</td>
                  <td>{evento.litros}</td>
                  <td>{evento.local}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    background: "#eef2f5",
  },
  header: {
    display: "flex",
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    padding: "1rem 2rem",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  headerTitle: {
    margin: 0,
    fontSize: "1.5rem",
  },
  logoutButton: {
    padding: "0.5rem 1rem",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  contentBox: {
    flex: 1,
    padding: "2rem",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start" as const, // alinha título e tabela à esquerda
  },
  title: {
    fontSize: "1.75rem",
    marginBottom: "1rem",
    textAlign: "left" as const,
    width: "100%",
  },
  scrollBox: {
    width: "100%",
    height: "70vh",
    overflowY: "auto" as const,
    background: "white",
    borderRadius: "10px",
    padding: "1rem",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
};
